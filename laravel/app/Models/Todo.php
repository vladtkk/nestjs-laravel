<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\TodoStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Todo extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'status',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => TodoStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
