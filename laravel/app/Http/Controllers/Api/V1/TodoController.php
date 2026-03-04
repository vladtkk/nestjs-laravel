<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\TodoStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Todo\CreateTodoRequest;
use App\Http\Requests\Todo\ListTodosRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use App\Services\TodoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class TodoController extends Controller
{
    public function __construct(
        private readonly TodoService $todoService,
    ) {}

    public function index(ListTodosRequest $request): AnonymousResourceCollection
    {
        $todos = $this->todoService->findAll(
            userId: $request->user()->id,
            perPage: (int) ($request->input('limit', 20)),
            status: $request->enum('status', TodoStatus::class),
        );

        return TodoResource::collection($todos);
    }

    public function store(CreateTodoRequest $request): JsonResponse
    {
        $todo = $this->todoService->create(
            $request->validated(),
            $request->user()->id,
        );

        return (new TodoResource($todo))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Todo $todo): TodoResource
    {
        $this->authorize('view', $todo);

        return new TodoResource($todo);
    }

    public function update(UpdateTodoRequest $request, Todo $todo): TodoResource
    {
        $this->authorize('update', $todo);

        $todo = $this->todoService->update($todo, $request->validated());

        return new TodoResource($todo);
    }

    public function destroy(Todo $todo): JsonResponse
    {
        $this->authorize('delete', $todo);

        $this->todoService->remove($todo);

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
