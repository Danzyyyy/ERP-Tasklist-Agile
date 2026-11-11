<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Services\ExternalIntegrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected ExternalIntegrationService $integrationService
    ) {}

    /**
     * User Login endpoint via Modul F-1 (POST /auth/login).
     * Accessible by Frontend to obtain real JWT or mock development token.
     */
    public function login(Request $request): JsonResponse
    {
        $usernameOrEmail = $request->input('emailOrUsername')
            ?? $request->input('username')
            ?? $request->input('email');

        $password = $request->input('password', '');
        $rememberMe = (bool) $request->input('rememberMe', false);

        if (empty($usernameOrEmail)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Parameter emailOrUsername/username dan password wajib diisi.',
            ], 422);
        }

        $result = $this->integrationService->loginF1($usernameOrEmail, $password, $rememberMe);

        if (!$result['success']) {
            return response()->json([
                'status' => 'error',
                'message' => $result['message'] ?? 'Login gagal.',
                'details' => $result['details'] ?? null,
            ], $result['status'] ?? 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil.',
            'data' => $result['data'],
        ], 200);
    }

    /**
     * Get identity of an account via Modul F-1 (GET /identity/accounts/{accountId}).
     */
    public function getAccountIdentity(Request $request, string $accountId): JsonResponse
    {
        $token = $request->bearerToken();
        $result = $this->integrationService->getF1Identity($accountId, $token);

        return response()->json([
            'status' => $result['success'] ? 'success' : 'error',
            'data' => $result['data'] ?? null,
            'message' => $result['message'] ?? null,
        ], $result['status'] ?? 200);
    }

    /**
     * Get role of an account via Modul F-1 (GET /accounts/{accountId}/role).
     */
    public function getAccountRole(Request $request, string $accountId): JsonResponse
    {
        $token = $request->bearerToken();
        $result = $this->integrationService->getF1Role($accountId, $token);

        return response()->json([
            'status' => $result['success'] ? 'success' : 'error',
            'data' => $result['data'] ?? null,
            'message' => $result['message'] ?? null,
        ], $result['status'] ?? 200);
    }

    /**
     * Get details of currently authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');

        return response()->json([
            'status' => 'success',
            'data' => $authUser,
        ]);
    }

    /**
     * Get available demo roles and their Bearer tokens for local development.
     */
    public function demoTokens(): JsonResponse
    {
        $roles = [
            [
                'role' => 'TECHNICAL_LEAD',
                'name' => 'Fauzan (Technical Lead)',
                'email' => 'tl@anaheim.id',
                'token' => 'mock_tl',
                'description' => 'Memiliki hak Dual-Approval Task Release dan Sign-off Final DONE.',
            ],
            [
                'role' => 'PROJECT_MANAGER',
                'name' => 'Tubagus M. Wildan (Project Manager)',
                'email' => 'pm@anaheim.id',
                'token' => 'mock_pm',
                'description' => 'Memiliki hak Dual-Approval Task Release dan Verifikasi Ceklis PM.',
            ],
            [
                'role' => 'DEVELOPER',
                'name' => 'Ariel (Frontend Dev)',
                'email' => 'dev@anaheim.id',
                'token' => 'mock_dev',
                'description' => 'Dapat menarik tugas ke Development dan mengajukan Code Review.',
            ],
            [
                'role' => 'DEVELOPER',
                'name' => 'Muhamad Fajri (Backend Dev)',
                'email' => 'fajri@anaheim.id',
                'token' => 'mock_fajri',
                'description' => 'Dapat menarik tugas ke Development, integrasi API Backend, dan update status.',
            ],
            [
                'role' => 'TESTER',
                'name' => 'Valdric (QA Tester)',
                'email' => 'tester@anaheim.id',
                'token' => 'mock_tester',
                'description' => 'Dapat melakukan pengujian QA dan memicu Alur Rework.',
            ],
        ];

        return response()->json([
            'status' => 'success',
            'data' => $roles,
        ]);
    }
}
