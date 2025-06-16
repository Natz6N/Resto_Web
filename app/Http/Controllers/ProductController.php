<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of products with filters
     */
    public function index(Request $request): View|JsonResponse
    {
        $query = Product::with(['category', 'discounts'])
                        ->when($request->category_id, function ($q, $categoryId) {
                            return $q->where('category_id', $categoryId);
                        })
                        ->when($request->status, function ($q, $status) {
                            return $q->where('status', $status);
                        })
                        ->when($request->is_featured, function ($q) {
                            return $q->where('is_featured', true);
                        })
                        ->when($request->search, function ($q, $search) {
                            return $q->where('name', 'like', "%{$search}%")
                                   ->orWhere('description', 'like', "%{$search}%");
                        });

        $products = $query->orderBy('sort_order')
                         ->orderBy('name')
                         ->paginate(15);

        $categories = Category::active()->ordered()->get();

        if ($request->wantsJson()) {
            return response()->json([
                'products' => $products,
                'categories' => $categories
            ]);
        }

        return view('products.index', compact('products', 'categories'));
    }

    /**
     * Show the form for creating a new product
     */
    public function create(): View
    {
        $categories = Category::active()->ordered()->get();
        return view('products.create', compact('categories'));
    }

    /**
     * Store a newly created product
     */
    public function store(StoreProductRequest $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validated();

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Handle gallery upload
        if ($request->hasFile('gallery')) {
            $gallery = [];
            foreach ($request->file('gallery') as $file) {
                $gallery[] = $file->store('products/gallery', 'public');
            }
            $validated['gallery'] = $gallery;
        }

        $product = Product::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Product created successfully',
                'product' => $product->load('category')
            ], 201);
        }

        return redirect()->route('products.index')
                        ->with('success', 'Product created successfully');
    }

    /**
     * Display the specified product
     */
    public function show(Product $product): View|JsonResponse
    {
        $product->load(['category', 'discounts.products', 'transactionItems']);

        if (request()->wantsJson()) {
            return response()->json(['product' => $product]);
        }

        return view('products.show', compact('product'));
    }

    /**
     * Show the form for editing the specified product
     */
    public function edit(Product $product): View
    {
        $categories = Category::active()->ordered()->get();
        return view('products.edit', compact('product', 'categories'));
    }

    /**
     * Update the specified product
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse|JsonResponse
    {
        $validated = $request->validated();

        // Generate slug if name changed
        if ($validated['name'] !== $product->name && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Handle gallery upload
        if ($request->hasFile('gallery')) {
            // Delete old gallery images
            if ($product->gallery) {
                foreach ($product->gallery as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
            $gallery = [];
            foreach ($request->file('gallery') as $file) {
                $gallery[] = $file->store('products/gallery', 'public');
            }
            $validated['gallery'] = $gallery;
        }

        $product->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Product updated successfully',
                'product' => $product->load('category')
            ]);
        }

        return redirect()->route('products.index')
                        ->with('success', 'Product updated successfully');
    }

    /**
     * Remove the specified product
     */
    public function destroy(Product $product): RedirectResponse|JsonResponse
    {
        // Check if product is used in transactions
        if ($product->transactionItems()->exists()) {
            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Cannot delete product that has been used in transactions'
                ], 422);
            }

            return redirect()->back()
                           ->with('error', 'Cannot delete product that has been used in transactions');
        }

        // Delete images
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        if ($product->gallery) {
            foreach ($product->gallery as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $product->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Product deleted successfully']);
        }

        return redirect()->route('products.index')
                        ->with('success', 'Product deleted successfully');
    }

    /**
     * Get products by category
     */
    public function byCategory(Category $category): JsonResponse
    {
        $products = $category->activeProducts()
                           ->available()
                           ->inStock()
                           ->orderBy('sort_order')
                           ->orderBy('name')
                           ->get();

        return response()->json(['products' => $products]);
    }

    /**
     * Get featured products
     */
    public function featured(): JsonResponse
    {
        $products = Product::with('category')
                          ->featured()
                          ->available()
                          ->inStock()
                          ->orderBy('sort_order')
                          ->limit(8)
                          ->get();

        return response()->json(['products' => $products]);
    }

    /**
     * Update product stock
     */
    public function updateStock(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $product->update(['stock' => $request->stock]);

        // Update status based on stock
        if ($request->stock == 0) {
            $product->update(['status' => 'out_of_stock']);
        } elseif ($product->status == 'out_of_stock') {
            $product->update(['status' => 'available']);
        }

        return response()->json([
            'message' => 'Stock updated successfully',
            'product' => $product
        ]);
    }

    /**
     * Get low stock products
     */
    public function lowStock(): JsonResponse
    {
        $products = Product::with('category')
                          ->whereNotNull('stock')
                          ->whereNotNull('min_stock')
                          ->whereColumn('stock', '<=', 'min_stock')
                          ->where('stock', '>', 0)
                          ->orderBy('stock')
                          ->get();

        return response()->json(['products' => $products]);
    }

    /**
     * Toggle product status
     */
    public function toggleStatus(Product $product): JsonResponse
    {
        $newStatus = match($product->status) {
            'available' => 'unavailable',
            'unavailable' => 'available',
            'out_of_stock' => 'available',
            default => 'available'
        };

        $product->update(['status' => $newStatus]);

        return response()->json([
            'message' => 'Product status updated successfully',
            'product' => $product
        ]);
    }
}
