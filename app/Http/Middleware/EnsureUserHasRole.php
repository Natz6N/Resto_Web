<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$abilities): Response
    {
        // Check if user has any of the provided abilities
        $hasAbility = false;
        foreach ($abilities as $ability) {
            if (Gate::allows($ability)) {
                $hasAbility = true;
                break;
            }
        }

        if (!$hasAbility) {
            // For API requests, return a JSON response
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unauthorized. You do not have permission to access this resource.'
                ], 403);
            }

            // For Inertia requests, redirect with flash message
            if ($request->inertia()) {
                return redirect()->route('dashboard')->with('error', 'You do not have permission to access this resource.');
            }

            // For web requests, redirect to the dashboard with an error message
            return redirect()->route('dashboard')->with('error', 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
