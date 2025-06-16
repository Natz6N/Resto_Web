<?php
namespace App\Http\Controllers;

use App\Http\Requests\DiscountStoreRequest;
use App\Http\Requests\DiscountUpdateRequest;
use App\Models\Discount;
use App\Models\Product;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    public function index()
    {
        $discounts = Discount::with(['products'])
            ->withCount('products')
            ->latest()
            ->paginate(10);

        return view('discounts.index', compact('discounts'));
    }

    public function create()
    {
        $products = Product::available()->with('category')->get();
        return view('discounts.create', compact('products'));
    }

    public function store(DiscountStoreRequest $request)
    {
        $data = $request->validated();

        $discount = Discount::create($data);

        if ($request->has('products')) {
            $discount->products()->sync($request->products);
        }

        return redirect()->route('discounts.index')
            ->with('success', 'Diskon berhasil ditambahkan.');
    }

    public function show(Discount $discount)
    {
        $discount->load(['products.category']);
        return view('discounts.show', compact('discount'));
    }

    public function edit(Discount $discount)
    {
        $products = Product::available()->with('category')->get();
        $discount->load('products');

        return view('discounts.edit', compact('discount', 'products'));
    }

    public function update(DiscountUpdateRequest $request, Discount $discount)
    {
        $data = $request->validated();

        $discount->update($data);

        if ($request->has('products')) {
            $discount->products()->sync($request->products);
        }

        return redirect()->route('discounts.index')
            ->with('success', 'Diskon berhasil diperbarui.');
    }

    public function destroy(Discount $discount)
    {
        $discount->delete();

        return redirect()->route('discounts.index')
            ->with('success', 'Diskon berhasil dihapus.');
    }

    public function toggleStatus(Discount $discount)
    {
        $discount->update(['is_active' => !$discount->is_active]);

        $status = $discount->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()
            ->with('success', "Diskon berhasil {$status}.");
    }

    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric|min:0'
        ]);

        $discount = Discount::where('code', $request->code)
            ->valid()
            ->first();

        if (!$discount) {
            return response()->json([
                'success' => false,
                'message' => 'Kode diskon tidak valid atau sudah expired.'
            ]);
        }

        $discountAmount = $discount->calculateDiscount($request->amount);

        return response()->json([
            'success' => true,
            'discount' => [
                'id' => $discount->id,
                'name' => $discount->name,
                'amount' => $discountAmount,
                'formatted_amount' => 'Rp ' . number_format($discountAmount, 0, ',', '.')
            ]
        ]);
    }
}
