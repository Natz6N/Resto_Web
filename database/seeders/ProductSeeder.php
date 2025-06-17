<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedMakananBerat();
        $this->seedMinumanDingin();
        $this->seedMinumanHangat();
        $this->seedDessert();
        $this->seedCamilan();
    }

    private function seedMakananBerat(): void
    {
        $category = Category::where('name', 'Makanan Berat')->first();

        $products = [
            [
                'name' => 'Nasi Goreng Spesial',
                'description' => 'Nasi goreng dengan telur, ayam, udang, dan sayuran segar. Disajikan dengan kerupuk dan acar.',
                'price' => 35000,
                'cost_price' => 21000,
                'preparation_time' => 15,
                'ingredients' => ['Nasi', 'Telur', 'Ayam', 'Udang', 'Kecap', 'Bawang Merah', 'Bawang Putih'],
                'calories' => 650,
                'is_spicy' => true,
            ],
            [
                'name' => 'Ayam Bakar Madu',
                'description' => 'Ayam bakar dengan bumbu madu special, disajikan dengan nasi, lalapan, dan sambal.',
                'price' => 45000,
                'cost_price' => 27000,
                'preparation_time' => 25,
                'ingredients' => ['Ayam', 'Madu', 'Kecap', 'Bawang Putih', 'Jahe', 'Mentega'],
                'calories' => 720,
                'is_spicy' => false,
            ],
            [
                'name' => 'Soto Ayam Kampung',
                'description' => 'Soto dengan kaldu ayam kampung, disajikan dengan soun, telur, dan emping.',
                'price' => 30000,
                'cost_price' => 18000,
                'preparation_time' => 10,
                'ingredients' => ['Ayam Kampung', 'Soun', 'Telur', 'Kol', 'Tauge', 'Seledri', 'Bawang Goreng'],
                'calories' => 450,
                'is_spicy' => false,
            ],
            [
                'name' => 'Rendang Sapi',
                'description' => 'Rendang daging sapi dengan rempah-rempah khas Padang, disajikan dengan nasi putih.',
                'price' => 55000,
                'cost_price' => 33000,
                'preparation_time' => 30,
                'ingredients' => ['Daging Sapi', 'Santan', 'Cabai', 'Lengkuas', 'Serai', 'Daun Jeruk', 'Rempah-rempah'],
                'calories' => 680,
                'is_spicy' => true,
                'is_featured' => true,
            ],
        ];

        $this->createProducts($products, $category->id);
    }

    private function seedMinumanDingin(): void
    {
        $category = Category::where('name', 'Minuman Dingin')->first();

        $products = [
            [
                'name' => 'Es Teh Manis',
                'description' => 'Teh manis dingin segar dengan es batu.',
                'price' => 10000,
                'cost_price' => 4000,
                'preparation_time' => 5,
                'ingredients' => ['Teh', 'Gula', 'Es Batu'],
                'calories' => 120,
                'is_spicy' => false,
            ],
            [
                'name' => 'Es Jeruk',
                'description' => 'Jeruk segar diperas dengan air dingin dan es batu.',
                'price' => 12000,
                'cost_price' => 5000,
                'preparation_time' => 5,
                'ingredients' => ['Jeruk', 'Gula', 'Es Batu'],
                'calories' => 100,
                'is_spicy' => false,
            ],
            [
                'name' => 'Jus Alpukat',
                'description' => 'Jus alpukat segar dengan susu kental manis.',
                'price' => 18000,
                'cost_price' => 9000,
                'preparation_time' => 8,
                'ingredients' => ['Alpukat', 'Susu Kental Manis', 'Gula', 'Es Batu'],
                'calories' => 250,
                'is_spicy' => false,
                'allergens' => ['Susu'],
            ],
        ];

        $this->createProducts($products, $category->id);
    }

    private function seedMinumanHangat(): void
    {
        $category = Category::where('name', 'Minuman Hangat')->first();

        $products = [
            [
                'name' => 'Kopi Hitam',
                'description' => 'Kopi hitam dengan biji kopi pilihan.',
                'price' => 12000,
                'cost_price' => 5000,
                'preparation_time' => 5,
                'ingredients' => ['Kopi'],
                'calories' => 5,
                'is_spicy' => false,
            ],
            [
                'name' => 'Teh Hangat',
                'description' => 'Teh hangat dengan pilihan gula sesuai selera.',
                'price' => 8000,
                'cost_price' => 3000,
                'preparation_time' => 3,
                'ingredients' => ['Teh', 'Gula'],
                'calories' => 40,
                'is_spicy' => false,
            ],
            [
                'name' => 'Wedang Jahe',
                'description' => 'Minuman jahe hangat dengan gula merah dan rempah.',
                'price' => 15000,
                'cost_price' => 6000,
                'preparation_time' => 10,
                'ingredients' => ['Jahe', 'Gula Merah', 'Serai', 'Kayu Manis'],
                'calories' => 80,
                'is_spicy' => false,
            ],
        ];

        $this->createProducts($products, $category->id);
    }

    private function seedDessert(): void
    {
        $category = Category::where('name', 'Dessert')->first();

        $products = [
            [
                'name' => 'Es Krim Vanilla',
                'description' => 'Es krim vanilla lembut dengan taburan coklat.',
                'price' => 15000,
                'cost_price' => 7000,
                'preparation_time' => 3,
                'ingredients' => ['Susu', 'Gula', 'Vanilla', 'Coklat'],
                'calories' => 200,
                'is_spicy' => false,
                'allergens' => ['Susu'],
            ],
            [
                'name' => 'Pudding Coklat',
                'description' => 'Pudding coklat lembut dengan saus vanilla.',
                'price' => 18000,
                'cost_price' => 8000,
                'preparation_time' => 5,
                'ingredients' => ['Susu', 'Coklat', 'Gula', 'Vanilla'],
                'calories' => 220,
                'is_spicy' => false,
                'allergens' => ['Susu'],
            ],
            [
                'name' => 'Pisang Goreng',
                'description' => 'Pisang goreng crispy dengan taburan keju dan coklat.',
                'price' => 20000,
                'cost_price' => 9000,
                'preparation_time' => 10,
                'ingredients' => ['Pisang', 'Tepung', 'Keju', 'Coklat'],
                'calories' => 300,
                'is_spicy' => false,
                'allergens' => ['Gluten', 'Susu'],
                'is_featured' => true,
            ],
        ];

        $this->createProducts($products, $category->id);
    }

    private function seedCamilan(): void
    {
        $category = Category::where('name', 'Camilan Ringan')->first();

        $products = [
            [
                'name' => 'Kentang Goreng',
                'description' => 'Kentang goreng renyah dengan saus sambal dan mayones.',
                'price' => 20000,
                'cost_price' => 8000,
                'preparation_time' => 10,
                'ingredients' => ['Kentang', 'Garam', 'Saus Sambal', 'Mayones'],
                'calories' => 350,
                'is_spicy' => false,
                'allergens' => ['Telur'],
            ],
            [
                'name' => 'Tempe Mendoan',
                'description' => 'Tempe mendoan dengan tepung crispy dan sambal kecap.',
                'price' => 15000,
                'cost_price' => 6000,
                'preparation_time' => 8,
                'ingredients' => ['Tempe', 'Tepung', 'Daun Bawang', 'Kecap'],
                'calories' => 250,
                'is_spicy' => false,
                'is_vegetarian' => true,
                'allergens' => ['Gluten'],
            ],
            [
                'name' => 'Tahu Crispy',
                'description' => 'Tahu crispy dengan bumbu rempah dan saus pedas.',
                'price' => 18000,
                'cost_price' => 7000,
                'preparation_time' => 8,
                'ingredients' => ['Tahu', 'Tepung', 'Rempah', 'Saus Pedas'],
                'calories' => 280,
                'is_spicy' => true,
                'is_vegetarian' => true,
                'allergens' => ['Gluten'],
            ],
        ];

        $this->createProducts($products, $category->id);
    }

    private function createProducts(array $products, int $categoryId): void
    {
        foreach ($products as $product) {
            $name = $product['name'];
            $slug = Str::slug($name);

            Product::create([
                'category_id' => $categoryId,
                'name' => $name,
                'slug' => $slug,
                'description' => $product['description'],
                'price' => $product['price'],
                'cost_price' => $product['cost_price'],
                'image' => 'Product/default.jpg',
                'gallery' => isset($product['gallery']) ? $product['gallery'] : null,
                'status' => 'available',
                'stock' => isset($product['stock']) ? $product['stock'] : null,
                'min_stock' => isset($product['min_stock']) ? $product['min_stock'] : 5,
                'sold_count' => isset($product['sold_count']) ? $product['sold_count'] : 0,
                'views' => isset($product['views']) ? $product['views'] : 0,
                'is_discountable' => isset($product['is_discountable']) ? $product['is_discountable'] : true,
                'is_featured' => isset($product['is_featured']) ? $product['is_featured'] : false,
                'preparation_time' => $product['preparation_time'],
                'ingredients' => isset($product['ingredients']) ? $product['ingredients'] : null,
                'allergens' => isset($product['allergens']) ? $product['allergens'] : null,
                'calories' => isset($product['calories']) ? $product['calories'] : null,
                'is_spicy' => isset($product['is_spicy']) ? $product['is_spicy'] : false,
                'is_vegetarian' => isset($product['is_vegetarian']) ? $product['is_vegetarian'] : false,
                'is_vegan' => isset($product['is_vegan']) ? $product['is_vegan'] : false,
                'sort_order' => isset($product['sort_order']) ? $product['sort_order'] : 0,
            ]);
        }
    }
}
