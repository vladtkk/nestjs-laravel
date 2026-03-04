<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\HealthService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class HealthController extends Controller
{
    public function __construct(
        private readonly HealthService $healthService,
    ) {}

    public function __invoke(): JsonResponse
    {
        $result = $this->healthService->check();

        $statusCode = $result['status'] === 'ok'
            ? Response::HTTP_OK
            : Response::HTTP_SERVICE_UNAVAILABLE;

        return response()->json($result, $statusCode);
    }
}
