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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->json('gallery')->nullable(); // Multiple images
            $table->enum('status', ['available', 'unavailable', 'out_of_stock'])->default('available');
            $table->integer('stock')->nullable()->default(null); // null = unlimited stock
            $table->integer('min_stock')->nullable()->default(5); // Minimum stock alert
            $table->boolean('is_discountable')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('preparation_time')->default(15); // in minutes
            $table->decimal('cost_price', 10, 2)->nullable(); // For profit calculation
            $table->json('ingredients')->nullable(); // List of ingredients
            $table->json('allergens')->nullable(); // Allergen information
            $table->integer('calories')->nullable();
            $table->boolean('is_spicy')->default(false);
            $table->boolean('is_vegetarian')->default(false);
            $table->boolean('is_vegan')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'status']);
            $table->index(['status', 'is_featured']);
            $table->index('slug');
            $table->index(['is_discountable', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
