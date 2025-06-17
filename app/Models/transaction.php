<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class transaction extends Model
{
    use HasFactory, SoftDeletes;

    // Payment status constants
    const PAYMENT_PENDING = 'pending';
    const PAYMENT_SUCCESS = 'success';
    const PAYMENT_FAILED = 'failed';
    const PAYMENT_CANCELED = 'canceled';

    // Order status constants
    const ORDER_PENDING = 'pending';
    const ORDER_PREPARING = 'preparing';
    const ORDER_READY = 'ready';
    const ORDER_SERVED = 'served';
    const ORDER_CANCELED = 'cancelled';

    protected $fillable = [
        'transaction_code',
        'cashier_id',
        'payment_method',
        'payment_status',
        'order_status',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'paid_amount',
        'change_amount',
        'customer_name',
        'table_number',
        'notes',
        'midtrans_transaction_id',
        'midtrans_response',
        'payment_token',
        'payment_url',
        'payment_data',
        'paid_at',
        'served_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'change_amount' => 'decimal:2',
        'midtrans_response' => 'array',
        'payment_data' => 'array',
        'paid_at' => 'datetime',
        'served_at' => 'datetime',
    ];

    // Relationships
    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(transaction_items::class);
    }

    // Scopes
    public function scopePaid($query)
    {
        return $query->where('payment_status', self::PAYMENT_SUCCESS);
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', self::PAYMENT_PENDING);
    }

    public function scopeFailed($query)
    {
        return $query->where('payment_status', self::PAYMENT_FAILED);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year);
    }

    // Accessors
    public function getPaymentStatusLabelAttribute()
    {
        return match($this->payment_status) {
            self::PAYMENT_PENDING => 'Menunggu Pembayaran',
            self::PAYMENT_SUCCESS => 'Dibayar',
            self::PAYMENT_FAILED => 'Gagal',
            self::PAYMENT_CANCELED => 'Dibatalkan',
            default => 'Unknown'
        };
    }

    public function getOrderStatusLabelAttribute()
    {
        return match($this->order_status) {
            self::ORDER_PENDING => 'Menunggu',
            self::ORDER_PREPARING => 'Sedang Dimasak',
            self::ORDER_READY => 'Siap Disajikan',
            self::ORDER_SERVED => 'Sudah Disajikan',
            self::ORDER_CANCELED => 'Dibatalkan',
            default => 'Unknown'
        };
    }

    public function getFormattedTotalAttribute()
    {
        return 'Rp ' . number_format($this->total_amount, 0, ',', '.');
    }

    public function getTotalItemsAttribute()
    {
        return $this->items->sum('quantity');
    }

    // Helper methods for payment processing
    public function isPending()
    {
        return $this->payment_status === self::PAYMENT_PENDING;
    }

    public function isPaid()
    {
        return $this->payment_status === self::PAYMENT_SUCCESS;
    }

    public function markAsPaid()
    {
        $this->payment_status = self::PAYMENT_SUCCESS;
        $this->paid_at = now();
        return $this->save();
    }

    public function markAsFailed()
    {
        $this->payment_status = self::PAYMENT_FAILED;
        return $this->save();
    }

    // Boot method for auto-generating transaction code
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (!$transaction->transaction_code) {
                $transaction->transaction_code = static::generateTransactionCode();
            }

            // Set default values if not provided
            if (!$transaction->payment_status) {
                $transaction->payment_status = self::PAYMENT_PENDING;
            }

            if (!$transaction->order_status) {
                $transaction->order_status = self::ORDER_PENDING;
            }
        });
    }

    public static function generateTransactionCode()
    {
        $date = now()->format('ymd');
        $lastTransaction = static::whereDate('created_at', today())
                                ->orderBy('id', 'desc')
                                ->first();

        $sequence = $lastTransaction ?
                   (intval(substr($lastTransaction->transaction_code, -3)) + 1) : 1;

        return 'TR' . $date . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }
}
