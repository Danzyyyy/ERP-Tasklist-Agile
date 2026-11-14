<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Models\Module;
use App\Services\ExternalIntegrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function __construct(
        protected ExternalIntegrationService $integrationService
    ) {}

    /**
     * List all modules with features.
     */
    public function index(Request $request): JsonResponse
    {
        $projectId = $request->input('project_id', 'PROJ-ERP-01');
        $modules = Module::with('features')->where('project_id', $projectId)->get();

        return response()->json([
            'status' => 'success',
            'data' => $modules,
        ]);
    }

    /**
     * Store new module.
     * Guarded: Role TL/PM only, and project must be REGISTERED in D-1.
     */
    public function store(Request $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $userRole = $authUser['role'] ?? null;

        // Role Guard: Only TL or PM can create new modules
        if (!in_array($userRole, ['TECHNICAL_LEAD', 'PROJECT_MANAGER'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya peran Technical Lead dan Project Manager yang berwenang membuat modul baru.',
            ], 403);
        }

        $validated = $request->validate([
            'project_id' => ['required', 'string'],
            'code' => ['required', 'string', 'unique:modules,code'],
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        // D-1 Guard Check: Status REGISTERED
        $guard = $this->integrationService->guardD1ProjectStatus($validated['project_id'], $request->bearerToken());
        if (!$guard['allowed']) {
            return response()->json([
                'status' => 'error',
                'code' => 'PROJECT_NOT_REGISTERED',
                'message' => $guard['message'],
            ], 422);
        }

        $module = Module::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Modul berhasil dibuat.',
            'data' => $module,
        ], 201);
    }

    /**
     * Store new feature under a module.
     * Guarded: Role TL/PM only, and parent module project must be REGISTERED.
     */
    public function storeFeature(Request $request, string $moduleId): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $userRole = $authUser['role'] ?? null;

        // Role Guard: Only TL or PM can add new features
        if (!in_array($userRole, ['TECHNICAL_LEAD', 'PROJECT_MANAGER'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya peran Technical Lead dan Project Manager yang berwenang menambahkan fitur baru.',
            ], 403);
        }

        $module = Module::findOrFail($moduleId);

        // D-1 Guard Check: Module's project must be REGISTERED
        $guard = $this->integrationService->guardD1ProjectStatus($module->project_id, $request->bearerToken());
        if (!$guard['allowed']) {
            return response()->json([
                'status' => 'error',
                'code' => 'PROJECT_NOT_REGISTERED',
                'message' => $guard['message'],
            ], 422);
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:features,code'],
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $feature = $module->features()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Fitur berhasil dibuat.',
            'data' => $feature,
        ], 201);
    }
}
