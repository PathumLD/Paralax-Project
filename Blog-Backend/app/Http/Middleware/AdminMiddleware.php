<?php


// app/Http/Middleware/AdminMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is authenticated and has admin privileges
        if (Auth::check() && Auth::user()->isAdmin) {
            return $next($request);
        }

        // If not admin, abort with a 403 Forbidden status
        return response()->json(['message' => 'Forbidden'], 403);
    }
}
