<?php

namespace Tests\Feature;

use App\Models\Todo;
use App\Models\User;
use App\Models\InAppNotification;
use App\Models\EmailNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_todo_and_notifications_are_sent()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/api/v1/todos', [
            'title' => 'Test Todo',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('todos', [
            'title' => 'Test Todo',
            'user_id' => $user->id,
        ]);

        // Check if notifications were saved (using current implementation)
        $this->assertDatabaseHas('in_app_notifications', [
            'user_id' => $user->id,
            'message' => "New TODO Created: Test Todo: You have successfully created a new task with the status: pending.",
        ]);

        $this->assertDatabaseHas('email_notifications', [
            'user_id' => $user->id,
            'subject' => 'New TODO Created: Test Todo',
        ]);
    }

    public function test_can_list_todos()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        Todo::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/v1/todos');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }
}
