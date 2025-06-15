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
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2); // Historical price
            $table->decimal('total_price', 10, 2);
            
            // Product snapshot for historical data
            $table->string('product_name'); // Snapshot of product name
            $table->text('product_description')->nullable();
            $table->string('product_image')->nullable();
            $table->string('category_name'); // Snapshot of category name
            
            $table->text('notes')->nullable(); // Special instructions
            $table->enum('status', ['pending', 'preparing', 'ready', 'served'])->default('pending');
            $table->timestamp('prepared_at')->nullable();
            $table->timestamps();

            $table->index(['transaction_id', 'product_id']);
            $table->index(['product_id', 'created_at']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
    }
};
