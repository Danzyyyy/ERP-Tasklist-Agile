<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Services\ExternalIntegrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExternalProjectController extends Controller
{
    public function __construct(
        protected ExternalIntegrationService $integrationService
    ) {}

    /**
     * Get project execution readiness from Modul E-3 (Prioritas Utama P6).
     * Endpoint: GET /api/v1/projects/{projectId}/execution-readiness
     */
    public function executionReadiness(Request $request, string $projectId): JsonResponse
    {
        $token = $request->bearerToken();
        $result = $this->integrationService->getE3ExecutionReadiness($projectId, $token);

        return response()->json([
            'status' => $result['success'] ? 'success' : 'error',
            'projectId' => $projectId,
            'data' => $result['data'] ?? null,
            'message' => $result['message'] ?? null,
        ], $result['status'] ?? 200);
    }

    /**
     * Get project intake information from Modul D-1.
     * Endpoint: GET /api/v1/projects/{projectId}
     */
    public function projectIntake(Request $request, string $projectId): JsonResponse
    {
        $token = $request->bearerToken();
        $result = $this->integrationService->getD1Project($projectId, $token);

        return response()->json([
            'status' => $result['success'] ? 'success' : 'error',
            'projectId' => $projectId,
            'data' => $result['data'] ?? null,
            'message' => $result['message'] ?? null,
        ], $result['status'] ?? 200);
    }

    /**
     * Validate project guard (must be REGISTERED in D-1).
     * Endpoint: GET /api/v1/projects/{projectId}/guard
     */
    public function projectGuard(Request $request, string $projectId): JsonResponse
    {
        $token = $request->bearerToken();
        $guard = $this->integrationService->guardD1ProjectStatus($projectId, $token);

        return response()->json([
            'status' => $guard['allowed'] ? 'success' : 'error',
            'projectId' => $projectId,
            'allowed' => $guard['allowed'],
            'projectStatus' => $guard['status'],
            'message' => $guard['message'],
            'data' => $guard['project'] ?? null,
        ], $guard['allowed'] ? 200 : 422);
    }
}

