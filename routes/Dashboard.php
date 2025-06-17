<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\NotificationController;

// Dashboard routes
Route::middleware(['auth', 'verified'])->prefix('dashboard')->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Notification routes (available to all authenticated users)
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
        Route::get('/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
        Route::post('/test', [NotificationController::class, 'sendTest'])->name('notifications.test');
    });

    // Routes for kasir (cashier) role
    Route::middleware(['can:kasir'])->prefix('kasir')->group(function () {
        // Transactions
        Route::get('/transactions', function () {
            return Inertia::render('Kasir/Transactions');
        })->name('kasir.transactions');

        // Payment processing
        Route::post('/payment/{id}/process', [PaymentController::class, 'process'])->name('kasir.payment.process');
        Route::put('/order/{id}/status', [OrderController::class, 'updateStatus'])->name('kasir.order.update-status');
    });

    // Routes for koki (chef) role
    Route::middleware(['can:koki'])->prefix('kitchen')->group(function () {
        // Orders management
        Route::get('/orders', [OrderController::class, 'index'])->name('kitchen.orders');
        Route::put('/order/{id}/status', [OrderController::class, 'updateStatus'])->name('kitchen.order.update-status');
        Route::get('/orders/updates', [OrderController::class, 'getUpdates'])->name('kitchen.orders.updates');
    });

    // Routes for admin role
    Route::middleware(['can:admin'])->prefix('admin')->group(function () {
        // Payment management
        Route::put('/payment/{id}/status', [PaymentController::class, 'updateStatus'])->name('admin.payment.update-status');
    });
});

// Payment simulation routes (accessible without auth for testing)
Route::prefix('payment')->group(function () {
    Route::get('/simulate/{token}', [PaymentController::class, 'simulatePayment'])->name('payment.simulate');
    Route::post('/simulate/{token}/result', [PaymentController::class, 'handleSimulationResult'])->name('payment.simulate.result');
});
