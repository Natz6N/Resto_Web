<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;

Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/{id}', [TransactionController::class, 'show']);
Route::get('/transactions/token/{token}', [TransactionController::class, 'getByToken']);
Route::get('/transactions/pending', [TransactionController::class, 'getPendingTransactions']);
