<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

// ================= AUTH ROUTES =================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected auth routes
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// ================= PRODUCT ROUTES =================
// Public product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Admin-only product routes (CRUD)
Route::middleware(['auth:api', 'admin'])->group(function () {
    Route::apiResource('products', ProductController::class)
        ->except(['index', 'show']); // karena sudah ada public index & show

    // Users list (admin only)
        Route::get('/users', [UserController::class, 'index']); // list semua user
});

// ================= ORDER ROUTES =================
// Protected order routes
Route::middleware('auth:api')->group(function () {
    Route::apiResource('orders', OrderController::class);

    Route::post('/orders/{order}/upload-payment', [OrderController::class, 'uploadPayment']);
});
