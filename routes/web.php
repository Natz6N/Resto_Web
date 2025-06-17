<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/Menu', [HomeController::class, 'products'])->name('products');
Route::get('/Menu/{slug}', [HomeController::class, 'showProduct'])->name('products.show');
Route::get('/category/{slug}', [HomeController::class, 'showCategory'])->name('category.show');
Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');
Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    // Routes that require either kasir or admin privileges
    Route::middleware(['can:kasir'])->prefix('kasir')->group(function () {
        Route::get('transactions', function () {
            return Inertia::render('Kasir/Transactions');
        })->name('kasir.transactions');
    });

    // Routes that require either koki or admin privileges
    Route::middleware(['can:koki'])->prefix('kitchen')->group(function () {
        Route::get('orders', function () {
            return Inertia::render('Kitchen/Orders');
        })->name('kitchen.orders');
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/Dashboard.php';
