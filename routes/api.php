<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Transaction API endpoints
Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/{id}', [TransactionController::class, 'show']);
Route::get('/transactions/token/{token}', [TransactionController::class, 'getByToken']);
Route::get('/transactions/pending', [TransactionController::class, 'getPendingTransactions']);

// Payment API endpoints
Route::post('/payment/{id}/process', [PaymentController::class, 'process']);
Route::post('/payment/{id}/cash-payment', [PaymentController::class, 'processCashPayment']);
Route::post('/payment/simulate/{token}/result', [PaymentController::class, 'handleSimulationResult']);
