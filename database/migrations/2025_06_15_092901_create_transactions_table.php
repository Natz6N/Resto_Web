<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_code')->unique(); // TR240601001
            $table->foreignId('cashier_id')->nullable()->constrained('users')->onDelete('restrict');
            $table->enum('payment_method', ['COD', 'Midtrans', 'Dummy'])->default('COD');
            $table->enum('payment_status', ['belum_dibayar', 'dibayar', 'batal'])->default('belum_dibayar');
            $table->enum('order_status', ['pending', 'preparing', 'ready', 'served', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('change_amount', 12, 2)->default(0);
            $table->string('customer_name')->nullable();
            $table->string('table_number')->nullable();
            $table->text('notes')->nullable();
            $table->string('midtrans_transaction_id')->nullable();
            $table->json('midtrans_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('served_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['cashier_id', 'created_at']);
            $table->index(['payment_status', 'created_at']);
            $table->index(['order_status', 'created_at']);
            $table->index('transaction_code');
            $table->index('midtrans_transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
