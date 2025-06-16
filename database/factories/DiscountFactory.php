<?php

namespace Database\Factories;

use App\Models\Discount;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscountFactory extends Factory
{
    protected $model = Discount::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement(['percentage', 'fixed', 'buy_one_get_one']);
        $value = match($type) {
            'percentage' => $this->faker->numberBetween(5, 30),
            'fixed' => $this->faker->numberBetween(5000, 25000),
            'buy_one_get_one' => 1,
        };

        return [
            'name' => $this->faker->randomElement([
                'Diskon Hari Ini', 'Promo Spesial', 'Diskon Weekend',
                'Flash Sale', 'Member Discount'
            ]),
            'code' => strtoupper($this->faker->bothify('DISC###')),
            'description' => $this->faker->sentence(),
            'type' => $type,
            'value' => $value,
            'minimum_amount' => $this->faker->boolean(60) ? $this->faker->numberBetween(50000, 100000) : null,
            'maximum_discount' => $type === 'percentage' ? $this->faker->numberBetween(25000, 100000) : null,
            'usage_limit' => $this->faker->boolean(70) ? $this->faker->numberBetween(50, 500) : null,
            'usage_count' => 0,
            'is_active' => $this->faker->boolean(80),
            'starts_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'expires_at' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'starts_at' => now()->subDay(),
            'expires_at' => now()->addWeek(),
        ]);
    }

    public function percentage(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'percentage',
            'value' => $this->faker->numberBetween(10, 25),
            'maximum_discount' => $this->faker->numberBetween(25000, 50000),
        ]);
    }

    public function fixed(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'fixed',
            'value' => $this->faker->numberBetween(10000, 30000),
            'maximum_discount' => null,
        ]);
    }
}
