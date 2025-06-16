<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        $subtotal = $this->faker->numberBetween(50000, 500000);
        $taxAmount = $subtotal * 0.11; // 11% tax
        $discountAmount = $this->faker->boolean(30) ? $subtotal * 0.1 : 0; // 10% discount sometimes
        $totalAmount = $subtotal + $taxAmount - $discountAmount;

        return [
            'transaction_code' => 'TR' . now()->format('ymd') . str_pad($this->faker->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
            'cashier_id' => User::factory()->kasir(),
            'payment_method' => $this->faker->randomElement(['COD', 'Midtrans', 'Dummy']),
            'payment_status' => $this->faker->randomElement(['belum_dibayar', 'dibayar', 'batal']),
            'order_status' => $this->faker->randomElement(['pending', 'preparing', 'ready', 'served', 'cancelled']),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'paid_amount' => $totalAmount,
            'change_amount' => $this->faker->numberBetween(0, 10000),
            'customer_name' => $this->faker->boolean(60) ? $this->faker->name() : null,
            'table_number' => $this->faker->boolean(70) ? 'T' . $this->faker->numberBetween(1, 20) : null,
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
            'midtrans_transaction_id' => null,
            'midtrans_response' => null,
            'paid_at' => $this->faker->boolean(80) ? $this->faker->dateTimeBetween('-1 week', 'now') : null,
            'served_at' => $this->faker->boolean(60) ? $this->faker->dateTimeBetween('-1 week', 'now') : null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'dibayar',
            'paid_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }

    public function unpaid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'belum_dibayar',
            'paid_at' => null,
        ]);
    }

    public function withMidtrans(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'Midtrans',
            'midtrans_transaction_id' => 'MT' . $this->faker->uuid(),
            'midtrans_response' => [
                'status_code' => '200',
                'status_message' => 'Success',
                'transaction_id' => $this->faker->uuid(),
            ],
        ]);
    }
}
