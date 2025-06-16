<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->randomElement([
            'Nasi Gudeg Jogja', 'Ayam Bakar Kecap', 'Rendang Daging', 'Soto Ayam',
            'Gado-gado Betawi', 'Bakso Malang', 'Mie Ayam Ceker', 'Pecel Lele',
            'Es Teh Manis', 'Es Jeruk', 'Kopi Tubruk', 'Jus Alpukat',
            'Es Campur', 'Es Doger', 'Puding Coklat', 'Klepon'
        ]);

        $price = $this->faker->numberBetween(15000, 75000);
        $costPrice = $price * 0.6; // 40% profit margin

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . $this->faker->randomNumber(3),
            'description' => $this->faker->paragraph(3),
            'price' => $price,
            'image' => 'products/' . $this->faker->uuid() . '.jpg',
            'gallery' => $this->faker->randomElements([
                'gallery/img1.jpg', 'gallery/img2.jpg', 'gallery/img3.jpg'
            ], $this->faker->numberBetween(1, 3)),
            'status' => $this->faker->randomElement(['available', 'unavailable', 'out_of_stock']),
            'stock' => $this->faker->boolean(70) ? $this->faker->numberBetween(0, 100) : null,
            'min_stock' => $this->faker->numberBetween(5, 15),
            'is_discountable' => $this->faker->boolean(80),
            'is_featured' => $this->faker->boolean(20),
            'preparation_time' => $this->faker->numberBetween(5, 30),
            'cost_price' => $costPrice,
            'ingredients' => $this->faker->randomElements([
                'Beras', 'Ayam', 'Santan', 'Cabai', 'Bawang Merah',
                'Bawang Putih', 'Garam', 'Gula', 'Kecap'
            ], $this->faker->numberBetween(3, 6)),
            'allergens' => $this->faker->randomElements([
                'Kacang', 'Susu', 'Telur', 'Gluten'
            ], $this->faker->numberBetween(0, 2)),
            'calories' => $this->faker->numberBetween(200, 800),
            'is_spicy' => $this->faker->boolean(40),
            'is_vegetarian' => $this->faker->boolean(30),
            'is_vegan' => $this->faker->boolean(15),
            'sort_order' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function withStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => $this->faker->numberBetween(10, 50),
        ]);
    }

    public function discountable(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_discountable' => true,
        ]);
    }
}
