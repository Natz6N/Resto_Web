<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SystemNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $type;
    public $message;
    public $data;
    public $for;

    /**
     * Create a new event instance.
     */
    public function __construct(string $type, string $message, array $data = [], array $for = ['all'])
    {
        $this->type = $type;
        $this->message = $message;
        $this->data = $data;
        $this->for = $for;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Always broadcast to the general notifications channel
        $channels = [new Channel('notifications')];

        // Role-specific channels
        if (in_array('admin', $this->for) || in_array('all', $this->for)) {
            $channels[] = new PrivateChannel('role.admin');
        }

        if (in_array('kasir', $this->for) || in_array('all', $this->for)) {
            $channels[] = new PrivateChannel('role.kasir');
        }

        if (in_array('koki', $this->for) || in_array('all', $this->for)) {
            $channels[] = new PrivateChannel('role.koki');
        }

        // If notification is for a specific user
        if (isset($this->data['user_id'])) {
            $channels[] = new PrivateChannel('user.' . $this->data['user_id']);
        }

        // If notification is for a specific transaction
        if (isset($this->data['transaction_id'])) {
            $channels[] = new Channel('transaction.' . $this->data['transaction_id']);
        }

        return $channels;
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'type' => $this->type,
            'message' => $this->message,
            'data' => $this->data,
            'for' => $this->for,
            'timestamp' => now()->toIso8601String(),
            'notification_type' => 'system',
            'id' => uniqid('notification_', true) // Generate a unique ID for the notification
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'system.notification';
    }
}
