<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;
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
}