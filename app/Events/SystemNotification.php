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
        // Based on who the notification is for, broadcast to different channels
        $channels = [new Channel('notifications')];

        if (in_array('admin', $this->for)) {
            $channels[] = new PrivateChannel('notifications.admin');
        }

        if (in_array('kasir', $this->for)) {
            $channels[] = new PrivateChannel('notifications.kasir');
        }

        if (in_array('koki', $this->for)) {
            $channels[] = new PrivateChannel('notifications.koki');
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
