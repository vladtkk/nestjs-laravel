<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\TodoStatus;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TodoFactory extends Factory
{
    protected $model = Todo::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'status' => fake()->randomElement(TodoStatus::cases()),
            'user_id' => User::factory(),
        ];
    }
}
