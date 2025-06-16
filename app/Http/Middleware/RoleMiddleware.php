<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            if ($request->inertia()) {
                return Inertia::render('Auth/Login', [
                    'error' => 'Please login to access this resource.'
                ])->toResponse($request)->setStatusCode(401);
            }
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Check if user has the required role
        if (Auth::user()->role !== $role) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if user is active
        if (!Auth::user()->is_active) {
            Auth::logout();
            if ($request->inertia()) {
                return Inertia::render('Auth/Login', [
                    'error' => 'Your account is inactive. Please contact the administrator.'
                ])->toResponse($request)->setStatusCode(403);
            }
            return response()->json(['error' => 'Account inactive'], 403);
        }

        return $next($request);
    }
}
