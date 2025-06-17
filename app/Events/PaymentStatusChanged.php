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

class PaymentStatusChanged implements ShouldBroadcast
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
        $this->message = $message ?: "Pembayaran #{$transaction->transaction_code} telah berubah status menjadi {$status}";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('payments'),
            new PrivateChannel('transactions'),
        ];
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
            'total_amount' => $this->transaction->total_amount,
            'customer_name' => $this->transaction->customer_name,
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
        return 'payment.status.changed';
    }
}
