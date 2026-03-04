<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\TodoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Health
    Route::get('/health', HealthController::class);

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    });

    // Todos
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('todos', TodoController::class);
    });
});
