<?php

use App\Http\Middleware\LogRequest;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            SecurityHeaders::class,
            LogRequest::class,
        ]);

        $middleware->throttleApi('60,1');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'statusCode' => 401,
                    'error' => 'Unauthorized',
                    'message' => $e->getMessage() ?: 'Unauthenticated.',
                    'timestamp' => now()->toISOString(),
                    'path' => '/' . $request->path(),
                ], 401);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                $previous = $e->getPrevious();
                $message = $previous instanceof ModelNotFoundException
                    ? $previous->getMessage()
                    : 'Not found';

                return response()->json([
                    'statusCode' => 404,
                    'error' => 'NotFoundHttpException',
                    'message' => $message,
                    'timestamp' => now()->toISOString(),
                    'path' => '/' . $request->path(),
                ], 404);
            }
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'statusCode' => 422,
                    'error' => 'ValidationException',
                    'message' => $e->errors(),
                    'timestamp' => now()->toISOString(),
                    'path' => '/' . $request->path(),
                ], 422);
            }
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') && !$e instanceof ValidationException && !$e instanceof NotFoundHttpException) {
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                return response()->json([
                    'statusCode' => $statusCode,
                    'error' => class_basename($e),
                    'message' => $statusCode === 500 ? 'Internal server error' : $e->getMessage(),
                    'timestamp' => now()->toISOString(),
                    'path' => '/' . $request->path(),
                ], $statusCode);
            }
        });
    })->create();
