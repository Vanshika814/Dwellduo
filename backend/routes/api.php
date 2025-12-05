<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\PreferencesController;
use App\Http\Controllers\API\MatchController;
use App\Http\Controllers\API\MessageController;

// Auth endpoints for SPA / API
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Preferences
    Route::get('/preferences', [PreferencesController::class, 'show']);
    Route::put('/preferences', [PreferencesController::class, 'update']);

    // generate and fetch matches
    Route::post('/matches/generate', [MatchController::class, 'generateMatches']);
    Route::get('/matches', [MatchController::class, 'index']);
    Route::post('/matches/{id}/accept', [MatchController::class, 'accept']);
    Route::post('/matches/{id}/reject', [MatchController::class, 'reject']);

    // Messages
    Route::get('/matches/{id}/messages', [MessageController::class, 'index']);
    Route::post('/matches/{id}/messages', [MessageController::class, 'send']);
});
