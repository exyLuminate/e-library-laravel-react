<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Periksa apakah user login DAN memiliki role 'admin'
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            // Redirect atau berikan error 403 (Forbidden)
            abort(403, 'Akses Dibatasi. Anda bukan Admin.');
        }
        return $next($request);
    }
}
