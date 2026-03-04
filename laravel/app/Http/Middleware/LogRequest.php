<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request);

        $duration = round((microtime(true) - $start) * 1000);
        $method = $request->method();
        $path = $request->path();
        $status = $response->getStatusCode();

        Log::info("{$method} {$path} {$status} - {$duration}ms");

        return $response;
    }
}
