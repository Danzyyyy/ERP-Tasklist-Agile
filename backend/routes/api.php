<?php

use App\Http\Controllers\Api\v1\ApprovalController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\ExternalProjectController;
use App\Http\Controllers\Api\v1\ModuleController;
use App\Http\Controllers\Api\v1\ProgressController;
use App\Http\Controllers\Api\v1\ReviewController;
use App\Http\Controllers\Api\v1\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Modul E-4 (Tasklist dan Eksekusi Agile)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Authentication endpoints (F-1 Login & Mock demo tokens)
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::get('/auth/demo-tokens', [AuthController::class, 'demoTokens']);

    // Authenticated API Endpoints (Bearer JWT Token with F-1 Claims)
    Route::middleware('jwt.verify')->group(function () {

        // User Profile & F-1 Identity Endpoints
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::get('/identity/accounts/{accountId}', [AuthController::class, 'getAccountIdentity']);
        Route::get('/identitas/akun/{accountId}', [AuthController::class, 'getAccountIdentity']); // Alias Bahasa
        Route::get('/accounts/{accountId}/role', [AuthController::class, 'getAccountRole']);
        Route::get('/akun/{accountId}/peran', [AuthController::class, 'getAccountRole']); // Alias Bahasa

        // Module & Feature Hierarchy
        Route::get('/modules', [ModuleController::class, 'index']);
        Route::post('/modules', [ModuleController::class, 'store']);
        Route::post('/modules/{moduleId}/features', [ModuleController::class, 'storeFeature']);

        // Task Management & Hierarchy Tree
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::get('/tasks/hierarchy', [TaskController::class, 'hierarchy']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::patch('/tasks/{id}/status', [TaskController::class, 'updateStatus']);
        Route::patch('/tasks/{id}/assign', [TaskController::class, 'assign']);

        // FTR-K04-03: Dual-Approval Task Release Gate
        Route::get('/tasks/{taskId}/approvals', [ApprovalController::class, 'index']);
        Route::post('/tasks/{taskId}/approvals', [ApprovalController::class, 'store']);

        // FTR-K04-05: Code Review, QA Testing, & Rework Loop
        Route::post('/tasks/{taskId}/reviews', [ReviewController::class, 'submitReview']);

        // FTR-K04-06: Verification & Completion Sign-off
        Route::patch('/tasks/{taskId}/pm-verify', [ReviewController::class, 'pmVerify']);
        Route::patch('/tasks/{taskId}/tl-signoff', [ReviewController::class, 'tlSignoff']);
        Route::patch('/tasks/{taskId}/sign-off-done', [ReviewController::class, 'tlSignoff']);

        // FTR-K04-07 & API-K04-01: Deliverable Progress Calculation Engine
        Route::get('/projects/{projectId}/deliverable-progress', [ProgressController::class, 'getDeliverableProgress']);
        Route::get('/modules/{moduleId}/progress', [ProgressController::class, 'getModuleProgress']);

        // Integrasi Eksternal: Modul E-3 (Execution Readiness - Prioritas P6) & Modul D-1 (Project Intake)
        Route::get('/projects/{projectId}/execution-readiness', [ExternalProjectController::class, 'executionReadiness']);
        Route::get('/projects/{projectId}', [ExternalProjectController::class, 'projectIntake']);
        Route::get('/projects/{projectId}/guard', [ExternalProjectController::class, 'projectGuard']);
    });
});
