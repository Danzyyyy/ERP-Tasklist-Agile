<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyJwtToken
{
    /**
     * Handle an incoming request.
     * Validates Bearer JWT Token or standard Mock F-1 contract token.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated: Bearer token is missing or invalid.',
            ], 401);
        }

        $token = trim(substr($authHeader, 7));

        $user = $this->parseToken($token);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired token.',
            ], 401);
        }

        $request->attributes->set('auth_user', $user);

        return $next($request);
    }

    /**
     * Parse and decode standard JWT or F-1 contract token.
     */
    protected function parseToken(string $token): ?array
    {
        // 1. Dev / Mock aliases for quick switching
        $mockPresets = [
            'mock_tl' => [
                'id' => '01926df4-0001-7000-8000-000000000001',
                'name' => 'Fauzan (Technical Lead)',
                'email' => 'tl@anaheim.id',
                'role' => 'TECHNICAL_LEAD',
            ],
            'mock_pm' => [
                'id' => '01926df4-0002-7000-8000-000000000002',
                'name' => 'Tubagus M. Wildan (Project Manager)',
                'email' => 'pm@anaheim.id',
                'role' => 'PROJECT_MANAGER',
            ],
            'mock_dev' => [
                'id' => '01926df4-0003-7000-8000-000000000003',
                'name' => 'Ariel (Frontend Dev)',
                'email' => 'dev@anaheim.id',
                'role' => 'DEVELOPER',
            ],
            'mock_tester' => [
                'id' => '01926df4-0004-7000-8000-000000000004',
                'name' => 'Valdric (QA Tester)',
                'email' => 'tester@anaheim.id',
                'role' => 'TESTER',
            ],
        ];

        if (isset($mockPresets[$token])) {
            return $mockPresets[$token];
        }

        // 2. Standard 3-part JWT decoding (base64url)
        $parts = explode('.', $token);
        if (count($parts) === 3) {
            $payloadBase64 = strtr($parts[1], '-_', '+/');
            $paddedPayload = str_pad($payloadBase64, strlen($payloadBase64) % 4, '=', STR_PAD_RIGHT);
            $decodedJson = base64_decode($paddedPayload);
            if ($decodedJson) {
                $payload = json_decode($decodedJson, true);
                if (is_array($payload) && isset($payload['role'])) {
                    return [
                        'id' => $payload['sub'] ?? $payload['id'] ?? '01926df4-0000-7000-8000-000000000000',
                        'name' => $payload['name'] ?? 'User',
                        'email' => $payload['email'] ?? 'user@anaheim.id',
                        'role' => $payload['role'],
                    ];
                }
            }
        }

        // 3. Simple base64 JSON payload
        $rawDecoded = base64_decode($token, true);
        if ($rawDecoded) {
            $json = json_decode($rawDecoded, true);
            if (is_array($json) && isset($json['role'])) {
                return [
                    'id' => $json['id'] ?? $json['sub'] ?? '01926df4-0000-7000-8000-000000000000',
                    'name' => $json['name'] ?? 'User',
                    'email' => $json['email'] ?? 'user@anaheim.id',
                    'role' => $json['role'],
                ];
            }
        }

        return null;
    }
}
