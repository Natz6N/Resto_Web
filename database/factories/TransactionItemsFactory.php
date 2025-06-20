<?php

namespace Database\Factories;

use App\Models\transaction_items;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionItemsFactory extends Factory
{
    protected $model = transaction_items::class;

    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 5);
        $unitPrice = $this->faker->numberBetween(15000, 75000);
        $totalPrice = $quantity * $unitPrice;

        return [
            'transaction_id' => Transaction::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'product_name' => $this->faker->randomElement([
                'Nasi Gudeg Jogja',
                'Ayam Bakar Kecap',
                'Rendang Daging',
                'Es Teh Manis',
                'Kopi Tubruk'
            ]),
            'product_description' => $this->faker->sentence(),
            'product_image' => 'products/' . $this->faker->uuid() . '.jpg',
            'category_name' => $this->faker->randomElement(['Makanan Utama', 'Minuman', 'Dessert']),
            'notes' => $this->faker->boolean(20) ? $this->faker->sentence() : null,
            'status' => $this->faker->randomElement(['pending', 'preparing', 'ready', 'served']),
            'prepared_at' => $this->faker->boolean(60) ? $this->faker->dateTimeBetween('-1 day', 'now') : null,
        ];
    }

    public function ready(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'ready',
            'prepared_at' => $this->faker->dateTimeBetween('-1 hour', 'now'),
        ]);
    }

    public function preparing(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'preparing',
            'prepared_at' => null,
        ]);
    }
}
