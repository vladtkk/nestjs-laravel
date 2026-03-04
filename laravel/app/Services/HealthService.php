<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\DB;

class HealthService
{
    public function check(): array
    {
        $dbStatus = $this->checkDatabase();
        $memoryStatus = $this->checkMemory();
        $diskStatus = $this->checkDisk();

        $info = array_filter([
            'database' => $dbStatus['status'] === 'up' ? $dbStatus : null,
            'memory_heap' => $memoryStatus['status'] === 'up' ? $memoryStatus : null,
            'storage' => $diskStatus['status'] === 'up' ? $diskStatus : null,
        ]);

        $error = array_filter([
            'database' => $dbStatus['status'] === 'down' ? $dbStatus : null,
            'memory_heap' => $memoryStatus['status'] === 'down' ? $memoryStatus : null,
            'storage' => $diskStatus['status'] === 'down' ? $diskStatus : null,
        ]);

        return [
            'status' => !empty($error) ? 'error' : 'ok',
            'info' => $info,
            'error' => $error,
            'details' => [
                'database' => $dbStatus,
                'memory_heap' => $memoryStatus,
                'storage' => $diskStatus,
            ],
        ];
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            return ['status' => 'up'];
        } catch (\Throwable $e) {
            return ['status' => 'down', 'message' => $e->getMessage()];
        }
    }

    private function checkMemory(): array
    {
        $memoryUsage = memory_get_usage(true);
        $memoryLimit = 150 * 1024 * 1024; // 150MB

        if ($memoryUsage < $memoryLimit) {
            return ['status' => 'up'];
        }

        return ['status' => 'down', 'message' => 'Memory usage exceeds 150MB'];
    }

    private function checkDisk(): array
    {
        $diskFree = disk_free_space('/');
        $diskTotal = disk_total_space('/');

        if ($diskFree !== false && $diskTotal !== false && ($diskFree / $diskTotal) > 0.1) {
            return ['status' => 'up'];
        }

        return ['status' => 'down', 'message' => 'Disk usage exceeds 90%'];
    }
}
