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

class OrderStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $transaction;
    public $status;
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(transaction $transaction, string $status, string $message = '')
    {
        $this->transaction = $transaction;
        $this->status = $status;
        $this->message = $message ?: "Pesanan #{$transaction->transaction_code} telah berubah status menjadi {$status}";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new Channel('orders'),              // Public channel for all orders
            new PrivateChannel('kitchen'),      // Private channel for kitchen staff
        ];

        // Add channel for customer if customer ID exists
        if ($this->transaction->customer_id) {
            $channels[] = new PrivateChannel('user.' . $this->transaction->customer_id);
        }

        // Add channel for transaction-specific updates
        $channels[] = new Channel('transaction.' . $this->transaction->id);

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
            'id' => $this->transaction->id,
            'transaction_code' => $this->transaction->transaction_code,
            'status' => $this->status,
            'message' => $this->message,
            'total_items' => $this->transaction->items->count(),
            'customer_name' => $this->transaction->customer_name,
            'table_number' => $this->transaction->table_number,
            'timestamp' => now()->toIso8601String(),
            'notification_type' => 'order_status'
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'order.status.changed';
    }
}
