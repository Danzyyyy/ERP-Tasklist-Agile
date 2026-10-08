<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
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
