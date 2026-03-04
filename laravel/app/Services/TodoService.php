<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\TodoStatus;
use App\Events\TodoCreated;
use App\Models\Todo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TodoService
{
    public function create(array $data, string $userId): Todo
    {
        $todo = Todo::create([
            'title' => $data['title'],
            'status' => $data['status'] ?? TodoStatus::PENDING,
            'user_id' => $userId,
        ]);

        TodoCreated::dispatch($todo);

        return $todo;
    }

    public function findAll(string $userId, int $perPage = 20, ?TodoStatus $status = null): LengthAwarePaginator
    {
        return Todo::where('user_id', $userId)
            ->when($status, fn($query, $status) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function update(Todo $todo, array $data): Todo
    {
        $todo->update($data);

        return $todo->fresh();
    }

    public function remove(Todo $todo): void
    {
        $todo->delete();
    }
}
