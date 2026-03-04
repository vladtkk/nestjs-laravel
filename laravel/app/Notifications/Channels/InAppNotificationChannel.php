<?php

declare(strict_types=1);

namespace App\Notifications\Channels;

use App\Models\InAppNotification;
use Illuminate\Notifications\Notification;

class InAppNotificationChannel
{
    public function send($notifiable, Notification $notification): void
    {
        $data = $notification->toInApp($notifiable);

        InAppNotification::create([
            'user_id' => $notifiable->id,
            'message' => "{$data['subject']}: {$data['body']}",
        ]);
    }
}
