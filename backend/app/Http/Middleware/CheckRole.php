<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request and enforce RBAC role authorization.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->attributes->get('auth_user');

        if (!$user || !isset($user['role'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Otentikasi dibutuhkan untuk mengakses sumber daya ini.',
            ], 401);
        }

        $userRole = $user['role'];

        if (!empty($roles) && !in_array($userRole, $roles)) {
            return response()->json([
                'status' => 'error',
                'message' => "Akses ditolak. Peran Anda ({$userRole}) tidak memiliki wewenang untuk aksi ini.",
            ], 403);
        }

        return $next($request);
    }
}
