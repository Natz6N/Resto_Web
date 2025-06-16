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
        return $query->where('payment_status', 'dibayar');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', 'belum_dibayar');
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
            'belum_dibayar' => 'Belum Dibayar',
            'dibayar' => 'Dibayar',
            'batal' => 'Batal',
            default => 'Unknown'
        };
    }

    public function getOrderStatusLabelAttribute()
    {
        return match($this->order_status) {
            'pending' => 'Menunggu',
            'preparing' => 'Sedang Dimasak',
            'ready' => 'Siap Disajikan',
            'served' => 'Sudah Disajikan',
            'cancelled' => 'Dibatalkan',
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

    // Boot method for auto-generating transaction code
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (!$transaction->transaction_code) {
                $transaction->transaction_code = static::generateTransactionCode();
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
