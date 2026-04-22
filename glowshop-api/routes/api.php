<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SkinQuizController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\AuthController;

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    
    // Reviews
    Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);
    Route::post('/products/{id}/reviews', [ReviewController::class, 'store']);

    // Skin Quiz
    Route::post('/skin-quiz', [SkinQuizController::class, 'store']);
    Route::get('/skin-quiz/recommendations', [SkinQuizController::class, 'recommendations']);

    // Cart & Checkout
    Route::post('/cart/validate', [CartController::class, 'validateCart']);
    Route::post('/orders', [CheckoutController::class, 'store']);

    // Admin Routes
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/stats', function () {
            return response()->json([
                'users_count' => \App\Models\User::count(),
                'products_count' => \App\Models\Product::count(),
                'orders_count' => \App\Models\Order::count(),
            ]);
        });
    });
});
