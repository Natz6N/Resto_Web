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
        Schema::table('transactions', function (Blueprint $table) {
            // Add missing payment-related columns
            if (!Schema::hasColumn('transactions', 'payment_token')) {
                $table->string('payment_token')->nullable()->after('midtrans_response');
            }

            if (!Schema::hasColumn('transactions', 'payment_url')) {
                $table->string('payment_url')->nullable()->after('payment_token');
            }

            if (!Schema::hasColumn('transactions', 'payment_data')) {
                $table->json('payment_data')->nullable()->after('payment_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['payment_token', 'payment_url', 'payment_data']);
        });
    }
};
