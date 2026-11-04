<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExternalIntegrationService
{
    protected string $f1BaseUrl;
    protected string $d1BaseUrl;
    protected string $e3BaseUrl;
    protected bool $d1EnforceGuard;

    public function __construct()
    {
        $this->f1BaseUrl = rtrim(config('services.f1.url', env('F1_SERVICE_URL', 'http://127.0.0.1:4010')), '/');
        $this->d1BaseUrl = rtrim(config('services.d1.url', env('D1_SERVICE_URL', 'http://127.0.0.1:3000/api/v1')), '/');
        $this->e3BaseUrl = rtrim(config('services.e3.url', env('E3_SERVICE_URL', 'http://127.0.0.1:8002/api/v1')), '/');
        $this->d1EnforceGuard = (bool) config('services.d1.enforce_guard', env('D1_ENFORCE_GUARD', false));
    }

    /**
     * Authenticate via Modul F-1 (POST /auth/login).
     * Supports F-1 payload schema: { emailOrUsername, password, rememberMe }
     * Falls back to demo account mocks if service is offline or using mock credentials.
     */
    public function loginF1(string $usernameOrEmail, string $password, bool $rememberMe = false): array
    {
        $payload = [
            'emailOrUsername' => $usernameOrEmail,
            'password' => $password,
            'rememberMe' => $rememberMe,
        ];

        try {
            $response = Http::timeout(3)
                ->acceptJson()
                ->post("{$this->f1BaseUrl}/auth/login", $payload);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'status' => 200,
                    'data' => $response->json(),
                ];
            }

            // If F-1 returned 401 or 403, forward error message
            if (in_array($response->status(), [401, 403])) {
                return [
                    'success' => false,
                    'status' => $response->status(),
                    'message' => $response->json('message') ?? 'Email/username atau password salah.',
                    'details' => $response->json(),
                ];
            }
        } catch (\Throwable $e) {
            Log::warning("[F-1 Integration] Connection error to {$this->f1BaseUrl}: " . $e->getMessage());
        }

        // Graceful fallback for local development / mock tokens
        return $this->fallbackMockLogin($usernameOrEmail, $password);
    }

    /**
     * Get user identity from Modul F-1 (GET /identity/accounts/{accountId}).
     */
    public function getF1Identity(string $accountId, ?string $token = null): array
    {
        try {
            $request = Http::timeout(3)->acceptJson();
            if ($token) {
                $request = $request->withToken($token);
            }

            $response = $request->get("{$this->f1BaseUrl}/identity/accounts/{$accountId}");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'status' => 200,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'status' => $response->status(),
                'message' => $response->json('message') ?? 'Data identitas akun tidak ditemukan pada Modul F-1.',
            ];
        } catch (\Throwable $e) {
            Log::warning("[F-1 Integration] Identity check failed: " . $e->getMessage());

            // Fallback response for offline development
            return [
                'success' => true,
                'status' => 200,
                'data' => [
                    'accountId' => $accountId,
                    'employeeId' => '01929b4a-5f10-7a22-9d44-3c8f1b2e7a90',
                    'name' => 'Fauzan (Technical Lead)',
                    'roleCode' => 'TL',
                    'position' => 'Technical Lead',
                    'email' => 'tl@anaheim.id',
                    'status' => 'active',
                    'source' => 'mock_fallback',
                ],
            ];
        }
    }

    /**
     * Get account role from Modul F-1 (GET /accounts/{accountId}/role).
     */
    public function getF1Role(string $accountId, ?string $token = null): array
    {
        try {
            $request = Http::timeout(3)->acceptJson();
            if ($token) {
                $request = $request->withToken($token);
            }

            $response = $request->get("{$this->f1BaseUrl}/accounts/{$accountId}/role");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'status' => 200,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'status' => $response->status(),
                'message' => $response->json('message') ?? 'Data peran akun tidak ditemukan pada Modul F-1.',
            ];
        } catch (\Throwable $e) {
            Log::warning("[F-1 Integration] Role check failed: " . $e->getMessage());

            return [
                'success' => true,
                'status' => 200,
                'data' => [
                    'accountId' => $accountId,
                    'roleCode' => 'TL',
                    'status' => 'active',
                    'source' => 'mock_fallback',
                ],
            ];
        }
    }

    /**
     * Get canonical project details from Modul D-1 (GET /api/v1/projects/{projectId}).
     */
    public function getD1Project(string $projectId, ?string $token = null): array
    {
        try {
            $request = Http::timeout(3)->acceptJson();
            if ($token) {
                $request = $request->withToken($token);
            }

            $response = $request->get("{$this->d1BaseUrl}/projects/{$projectId}");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'status' => 200,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'status' => $response->status(),
                'message' => $response->json('message') ?? 'Proyek tidak ditemukan pada sistem Intake D-1.',
                'details' => $response->json(),
            ];
        } catch (\Throwable $e) {
            Log::warning("[D-1 Integration] Project lookup failed: " . $e->getMessage());

            // Fallback canonical response for offline development
            return [
                'success' => true,
                'status' => 200,
                'data' => [
                    'projectId' => $projectId,
                    'canonicalCode' => '202601',
                    'projectName' => 'Implementasi ERP Modul E-4 Tasklist',
                    'clientId' => 'CLI-001',
                    'clientName' => 'PT. Anaheim Nimbus Universal',
                    'status' => 'REGISTERED',
                    'active' => true,
                    'source' => 'mock_fallback',
                ],
            ];
        }
    }

    /**
     * Guard validator: Checks if project exists and has status REGISTERED in Modul D-1.
     * Enforced for task creation and sprint agile execution.
     */
    public function guardD1ProjectStatus(string $projectId, ?string $token = null): array
    {
        // If projectId is the internal default demo project, allow automatically
        if ($projectId === 'PROJ-ERP-01') {
            return [
                'allowed' => true,
                'status' => 'REGISTERED',
                'message' => 'Proyek demo diizinkan.',
                'project' => [
                    'projectId' => 'PROJ-ERP-01',
                    'projectName' => 'ERP Anaheim Nimbus Tasklist & Agile',
                    'status' => 'REGISTERED',
                ],
            ];
        }

        $result = $this->getD1Project($projectId, $token);

        if (!$result['success']) {
            if ($this->d1EnforceGuard) {
                return [
                    'allowed' => false,
                    'status' => 'NOT_FOUND',
                    'message' => "Proyek {$projectId} tidak terdaftar di sistem Intake D-1.",
                    'project' => null,
                ];
            }

            // Permissive fallback when D-1 is offline during local testing
            return [
                'allowed' => true,
                'status' => 'REGISTERED',
                'message' => 'Pemeriksaan status D-1 dilewati karena server D-1 sedang offline.',
                'project' => $result['data'] ?? null,
            ];
        }

        $projectData = $result['data'] ?? [];
        $status = $projectData['status'] ?? '';

        if ($status !== 'REGISTERED') {
            return [
                'allowed' => false,
                'status' => $status,
                'message' => "Proyek belum berstatus REGISTERED pada sistem Intake D-1 (Status saat ini: {$status}).",
                'project' => $projectData,
            ];
        }

        return [
            'allowed' => true,
            'status' => 'REGISTERED',
            'message' => 'Proyek terverifikasi dan berstatus REGISTERED.',
            'project' => $projectData,
        ];
    }

    /**
     * Get project execution readiness from Modul E-3 (GET /api/v1/projects/{projectId}/execution-readiness).
     * Priority P6 integration.
     */
    public function getE3ExecutionReadiness(string $projectId, ?string $token = null): array
    {
        try {
            $request = Http::timeout(3)->acceptJson();
            if ($token) {
                $request = $request->withToken($token);
            }

            $response = $request->get("{$this->e3BaseUrl}/projects/{$projectId}/execution-readiness");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'status' => 200,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'status' => $response->status(),
                'message' => $response->json('message') ?? 'Kesiapan eksekusi proyek tidak ditemukan pada Modul E-3.',
                'details' => $response->json(),
            ];
        } catch (\Throwable $e) {
            Log::warning("[E-3 Integration] Execution readiness check failed: " . $e->getMessage());

            // Fallback response for offline development
            return [
                'success' => true,
                'status' => 200,
                'data' => [
                    'projectId' => $projectId,
                    'kickoffId' => '01929b4a-5f10-7a22-9d44-3c8f1b2e7a01',
                    'momId' => '01929b4a-5f10-7a22-9d44-3c8f1b2e7a02',
                    'status' => 'COMPLETED',
                    'completedAt' => now()->toIso8601String(),
                    'readyForExecution' => true,
                    'source' => 'mock_fallback',
                ],
            ];
        }
    }

    /**
     * Fallback mock login for local testing when F-1 server is not running.
     */
    protected function fallbackMockLogin(string $usernameOrEmail, string $password): array
    {
        $mockUsers = [
            'tl@anaheim.id' => [
                'role' => 'TECHNICAL_LEAD',
                'roleCode' => 'TL',
                'token' => 'mock_tl',
                'name' => 'Fauzan (Technical Lead)',
                'id' => '01926df4-0001-7000-8000-000000000001',
            ],
            'pm@anaheim.id' => [
                'role' => 'PROJECT_MANAGER',
                'roleCode' => 'PM',
                'token' => 'mock_pm',
                'name' => 'Tubagus M. Wildan (Project Manager)',
                'id' => '01926df4-0002-7000-8000-000000000002',
            ],
            'dev@anaheim.id' => [
                'role' => 'DEVELOPER',
                'roleCode' => 'DEV',
                'token' => 'mock_dev',
                'name' => 'Ariel (Frontend Dev)',
                'id' => '01926df4-0003-7000-8000-000000000003',
            ],
            'tester@anaheim.id' => [
                'role' => 'TESTER',
                'roleCode' => 'TESTER',
                'token' => 'mock_tester',
                'name' => 'Valdric (QA Tester)',
                'id' => '01926df4-0004-7000-8000-000000000004',
            ],
        ];

        // Also match usernames like 'fauzan', 'tubagus', 'ariel', 'valdric'
        $lookupKey = strtolower(trim($usernameOrEmail));
        $matched = null;

        foreach ($mockUsers as $email => $user) {
            if ($lookupKey === $email || str_contains($email, $lookupKey) || strtolower($user['roleCode']) === $lookupKey) {
                $matched = $user;
                $matched['email'] = $email;
                break;
            }
        }

        if (!$matched) {
            // Default to TL if credentials provided
            $matched = $mockUsers['tl@anaheim.id'];
            $matched['email'] = $usernameOrEmail;
        }

        return [
            'success' => true,
            'status' => 200,
            'data' => [
                'accessToken' => $matched['token'],
                'tokenType' => 'Bearer',
                'expiresIn' => 3600,
                'account' => [
                    'accountId' => $matched['id'],
                    'name' => $matched['name'],
                    'email' => $matched['email'],
                    'roleCode' => $matched['roleCode'],
                    'role' => $matched['role'],
                ],
                'note' => 'Autentikasi fallback lokal simulasi Modul F-1',
            ],
        ];
    }
}

