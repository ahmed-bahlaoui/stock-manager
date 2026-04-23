<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{order}', [OrderController::class, 'show']);
Route::get('/stock-movements', [StockMovementController::class, 'index']);
Route::get('/stock-movements/{stockMovement}', [StockMovementController::class, 'show']);
Route::post('/stock-movements/stock-in', [StockMovementController::class, 'stockIn']);
Route::post('/orders', [OrderController::class, 'store']);
