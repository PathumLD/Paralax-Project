<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    protected function unauthenticated($request, array $guards)
{
    throw new Authenticationexception(
        'Unauthenticated.', $guards, $this->redirectTo($request)
    );
}

protected function redirectTo($request)
{
    if (!$request->expectsJson()) {
        return null; // For API applications, return null to prevent redirection
    }
}


}
