<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionStoreRequest;
use App\Models\Transaction;
use App\Models\transaction_items;
use App\Models\Product;
use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['cashier', 'items.product'])
            ->withCount('items');

        // Filter by status
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('order_status')) {
            $query->where('order_status', $request->order_status);
        }

        // Filter by date
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->latest()->paginate(15);

        return view('transactions.index', compact('transactions'));
    }

    public function create()
    {
        $products = Product::with('category')
            ->available()
            ->inStock()
            ->ordered()
            ->get();

        return view('transactions.create', compact('products'));
    }

    public function store(TransactionStoreRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            $data['cashier_id'] = Auth::id();

            // Calculate totals
            $subtotal = 0;
            $items = [];

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Check stock
                if ($product->stock !== null && $product->stock < $item['quantity']) {
                    throw new \Exception("Stok produk {$product->name} tidak mencukupi.");
                }

                $totalPrice = $product->price * $item['quantity'];
                $subtotal += $totalPrice;

                $items[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $totalPrice,
                    'product_name' => $product->name,
                    'product_description' => $product->description,
                    'product_image' => $product->image,
                    'category_name' => $product->category->name,
                    'notes' => $item['notes'] ?? null,
                ];
            }

            // Apply discount if provided
            $discountAmount = 0;
            if (!empty($data['discount_code'])) {
                $discount = Discount::where('code', $data['discount_code'])
                    ->valid()
                    ->first();

                if ($discount) {
                    $discountAmount = $discount->calculateDiscount($subtotal);
                    $discount->increment('usage_count');
                }
            }

            // Calculate final total
            $taxAmount = $data['tax_amount'] ?? 0;
            $totalAmount = $subtotal + $taxAmount - $discountAmount;

            // Create transaction
            $transaction = Transaction::create([
                'cashier_id' => $data['cashier_id'],
                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_status'] ?? 'belum_dibayar',
                'order_status' => 'pending',
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'paid_amount' => $data['paid_amount'] ?? 0,
                'change_amount' => max(0, ($data['paid_amount'] ?? 0) - $totalAmount),
                'customer_name' => $data['customer_name'] ?? null,
                'table_number' => $data['table_number'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Create transaction items
            foreach ($items as $item) {
                $item['transaction_id'] = $transaction->id;
                transaction_items::create($item);

                // Update stock
                $product = Product::find($item['product_id']);
                if ($product->stock !== null) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            DB::commit();

            return redirect()->route('transactions.show', $transaction)
                ->with('success', 'Transaksi berhasil dibuat.');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['cashier', 'items.product.category']);
        return view('transactions.show', compact('transaction'));
    }

    public function updatePaymentStatus(Request $request, Transaction $transaction)
    {
        $request->validate([
            'payment_status' => 'required|in:belum_dibayar,dibayar,batal',
            'paid_amount' => 'required_if:payment_status,dibayar|numeric|min:0'
        ]);

        $updateData = [
            'payment_status' => $request->payment_status
        ];

        if ($request->payment_status === 'dibayar') {
            $updateData['paid_amount'] = $request->paid_amount;
            $updateData['change_amount'] = max(0, $request->paid_amount - $transaction->total_amount);
            $updateData['paid_at'] = now();
        }

        $transaction->update($updateData);

        return redirect()->back()
            ->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    public function updateOrderStatus(Request $request, Transaction $transaction)
    {
        $request->validate([
            'order_status' => 'required|in:pending,preparing,ready,served,cancelled'
        ]);

        $updateData = ['order_status' => $request->order_status];

        if ($request->order_status === 'served') {
            $updateData['served_at'] = now();
        }

        $transaction->update($updateData);

        return redirect()->back()
            ->with('success', 'Status pesanan berhasil diperbarui.');
    }

    public function receipt(Transaction $transaction)
    {
        $transaction->load(['cashier', 'items.product.category']);
        return view('transactions.receipt', compact('transaction'));
    }
}
