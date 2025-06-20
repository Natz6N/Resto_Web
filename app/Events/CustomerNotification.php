<?php

namespace App\Events;

use App\Models\transaction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CustomerNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $type;
    public $message;
    public $transaction;
    public $data;

    /**
     * Create a new event instance.
     */
    public function __construct(
        string $type,
        string $message,
        transaction $transaction,
        array $data = []
    ) {
        $this->type = $type;
        $this->message = $message;
        $this->transaction = $transaction;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            // Public channel specific to this transaction
            new Channel('transaction.' . $this->transaction->id),
        ];

        // If customer has an ID (user account), send to their private channel
        if (!empty($this->transaction->customer_id)) {
            $channels[] = new PrivateChannel('user.' . $this->transaction->customer_id);
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
            'transaction_id' => $this->transaction->id,
            'transaction_code' => $this->transaction->transaction_code,
            'status' => [
                'payment' => $this->transaction->payment_status,
                'order' => $this->transaction->order_status,
            ],
            'timestamp' => now()->toIso8601String(),
            'data' => $this->data,
            'notification_type' => 'customer',
            'id' => uniqid('notification_', true)
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'customer.notification';
    }
}