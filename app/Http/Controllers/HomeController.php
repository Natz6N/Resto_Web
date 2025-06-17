<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $menu = Product::all();

        $carouselCategories = Category::where('is_active', true)->get();
        $carouselProductPopular = Product::Popular()->limit(12)->get();

        return Inertia::render('Web/Home', [
            'menu' => $menu,
            'carouselCategories' => $carouselCategories,
            'carouselProductPopular' => $carouselProductPopular,
        ]);
    }
    public function productDetail($slug)
    {
        $product = Product::where('slug', $slug)->first();
        $recommendations = Product::where('category_id', $product->category_id)->where('id', '!=', $product->id)->limit(4)->get();
        return Inertia::render('ProductDetail', [
            'product' => $product,
            'recommendations' => $recommendations,
        ]);
    }
    public function products(Request $request)
    {
        $categories = Category::where('is_active', true)->get();

        $query = Product::query();

        // Filter by search term
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
        }

        // Filter by category
        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category_id', $request->input('category'));
        }

        // Sort products
        $sortBy = $request->input('sort', 'name');
        $sortOrder = $request->input('order', 'asc');

        $query->orderBy($sortBy, $sortOrder);

        $products = $query->with(['category', 'discounts'])->get();

        return Inertia::render('Web/Product', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', 'all'),
                'sort' => $sortBy,
                'order' => $sortOrder
            ]
        ]);
    }
    public function searchProducts(Request $request)
    {
        $query = Product::query()->with(['category', 'discounts']);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
        }

        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category_id', $request->input('category'));
        }

        $sortBy = $request->input('sort', 'name');
        $sortOrder = $request->input('order', 'asc');

        $products = $query->orderBy($sortBy, $sortOrder)->get();

        return response()->json($products);
    }
    public function showProduct($slug)
    {
        $product = Product::where('slug', $slug)->with(['category', 'discounts'])->first();
        return Inertia::render('Web/ShowProduct', [
            'product' => $product,
        ]);
    }
    public function showCategory($slug)
    {
        $category = Category::where('slug', $slug)->first();
        return Inertia::render('Web/ShowCategory', [
            'category' => $category,
        ]);
    }

    public function about()
    {
        return Inertia::render('Web/About');
    }
}