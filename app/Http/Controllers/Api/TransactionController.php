<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\transaction;
use App\Models\transaction_items;
use App\Models\Product;
use App\Models\activity_log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    /**
     * Get pending transactions
     */
    public function getPendingTransactions()
    {
        $transactions = transaction::where('payment_status', 'belum_dibayar')
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($transactions);
    }

    /**
     * Create a new transaction
     */
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'customer_name' => 'nullable|string|max:255',
            'table_number' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // Create transaction
            $transaction = new transaction();
            $transaction->cashier_id = Auth::check() ? Auth::id() : null;
            $transaction->payment_status = 'belum_dibayar';
            $transaction->order_status = 'pending';
            $transaction->subtotal = $request->subtotal;
            $transaction->tax_amount = $request->tax_amount;
            $transaction->total_amount = $request->total_amount;
            $transaction->customer_name = $request->customer_name;
            $transaction->table_number = $request->table_number;
            $transaction->save();

            // Create transaction items
            foreach ($request->items as $item) {
                $product = Product::with('category')->find($item['product_id']);

                $transactionItem = new transaction_items();
                $transactionItem->transaction_id = $transaction->id;
                $transactionItem->product_id = $item['product_id'];
                $transactionItem->quantity = $item['quantity'];
                $transactionItem->unit_price = $item['unit_price'];
                $transactionItem->total_price = $item['total_price'];
                $transactionItem->product_name = $product->name;
                $transactionItem->category_name = $product->category->name;
                $transactionItem->notes = $item['notes'] ?? null;
                $transactionItem->save();

                // Update product sold count
                $product->sold_count = $product->sold_count + $item['quantity'];
                $product->save();
            }

            // Log activity
            activity_log::create([
                'log_name' => 'transactions',
                'description' => "Created new transaction {$transaction->transaction_code} with " . count($request->items) . " items",
                'causer_type' => Auth::user() ? get_class(Auth::user()) : null,
                'causer_id' => Auth::id(),
                'subject_type' => get_class($transaction),
                'subject_id' => $transaction->id,
                'properties' => [
                    'total_amount' => $transaction->total_amount,
                    'items_count' => count($request->items)
                ]
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'transaction_id' => $transaction->id,
                'transaction_code' => $transaction->transaction_code,
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Transaction failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get transaction details
     */
    public function show($id)
    {
        $transaction = transaction::with(['items.product', 'cashier'])
            ->findOrFail($id);

        return response()->json($transaction);
    }

    /**
     * Get transaction by token
     */
    public function getByToken($token)
    {
        $transaction = transaction::where('payment_token', $token)
            ->with(['items.product'])
            ->firstOrFail();

        return response()->json($transaction);
    }
}
