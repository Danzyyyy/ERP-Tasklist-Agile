<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExternalIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test POST /api/v1/auth/login via Modul F-1 integration.
     */
    public function test_auth_login_with_f1_payload_or_fallback(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'emailOrUsername' => 'tl@anaheim.id',
            'password' => 'Rahasia#2026',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'data' => [
                    'accessToken',
                    'tokenType',
                    'account' => [
                        'accountId',
                        'name',
                        'email',
                        'roleCode',
                    ],
                ],
            ]);
    }

    /**
     * Test GET /api/v1/identity/accounts/{accountId} and Indonesian alias.
     */
    public function test_get_f1_identity_endpoint(): void
    {
        $accountId = '01929b4a-6e2a-7b3f-8c71-0ab4e3d9f2a1';

        // English path
        $responseEn = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->getJson("/api/v1/identity/accounts/{$accountId}");

        $responseEn->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'data' => ['accountId', 'name', 'roleCode'],
            ]);

        // Indonesian alias path
        $responseId = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->getJson("/api/v1/identitas/akun/{$accountId}");

        $responseId->assertStatus(200)
            ->assertJsonPath('status', 'success');
    }

    /**
     * Test GET /api/v1/accounts/{accountId}/role and Indonesian alias.
     */
    public function test_get_f1_role_endpoint(): void
    {
        $accountId = '01929b4a-6e2a-7b3f-8c71-0ab4e3d9f2a1';

        // English path
        $responseEn = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->getJson("/api/v1/accounts/{$accountId}/role");

        $responseEn->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'data' => ['accountId', 'roleCode', 'status'],
            ]);

        // Indonesian alias path
        $responseId = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->getJson("/api/v1/akun/{$accountId}/peran");

        $responseId->assertStatus(200)
            ->assertJsonPath('status', 'success');
    }

    /**
     * Test GET /api/v1/projects/{projectId}/execution-readiness (Modul E-3 Prioritas Utama P6).
     */
    public function test_get_e3_execution_readiness_endpoint(): void
    {
        $projectId = 'PROJ-ERP-01';

        $response = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->getJson("/api/v1/projects/{projectId}/execution-readiness");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('projectId', $projectId)
            ->assertJsonStructure([
                'status',
                'projectId',
                'data' => [
                    'projectId',
                    'readyForExecution',
                ],
            ]);
    }

    /**
     * Test GET /api/v1/projects/{projectId} and /guard (Modul D-1 Intake).
     */
    public function test_get_d1_project_intake_and_guard_endpoint(): void
    {
        $projectId = 'PROJ-ERP-01';

        // 1. Project Details
        $response = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->getJson("/api/v1/projects/{projectId}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'projectId',
                'data' => ['projectId', 'status'],
            ]);

        // 2. Guard Check
        $guardResponse = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->getJson("/api/v1/projects/{projectId}/guard");

        $guardResponse->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('allowed', true)
            ->assertJsonPath('projectStatus', 'REGISTERED');
    }
}

