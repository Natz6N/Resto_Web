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
        $channels = [
            new Channel('payments'),                // Public channel for all payments
            new PrivateChannel('transactions'),     // Private channel for transaction history
            new PrivateChannel('role.kasir'),       // Private channel for cashiers
        ];

        // Add channel for customer if customer ID exists
        if ($this->transaction->customer_id) {
            $channels[] = new PrivateChannel('user.' . $this->transaction->customer_id);
        }

        // If transaction is paid, also notify kitchen staff
        if ($this->status === 'dibayar') {
            $channels[] = new PrivateChannel('role.koki');
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
        $data = [
            'id' => $this->transaction->id,
            'transaction_code' => $this->transaction->transaction_code,
            'status' => $this->status,
            'message' => $this->message,
            'total_amount' => $this->transaction->total_amount,
            'customer_name' => $this->transaction->customer_name,
            'timestamp' => now()->toIso8601String(),
            'notification_type' => 'payment_status',
            'payment_method' => $this->transaction->payment_method
        ];

        // Add payment-specific details if paid
        if ($this->status === 'dibayar' && $this->transaction->payment_method === 'COD') {
            $data['paid_amount'] = $this->transaction->paid_amount;
            $data['change_amount'] = $this->transaction->change_amount;
        }

        return $data;
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
