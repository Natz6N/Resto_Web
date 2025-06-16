<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Makanan Berat', 'color' => '#EF4444', 'icon' => 'fa-solid fa-bowl-food'],
            ['name' => 'Minuman Dingin', 'color' => '#3B82F6', 'icon' => 'fa-solid fa-glass-water'],
            ['name' => 'Minuman Hangat', 'color' => '#F59E0B', 'icon' => 'fa-solid fa-mug-hot'],
            ['name' => 'Dessert', 'color' => '#EC4899', 'icon' => 'fa-solid fa-ice-cream'],
            ['name' => 'Roti & Pastry', 'color' => '#D97706', 'icon' => 'fa-solid fa-bread-slice'],
            ['name' => 'Menu Sarapan', 'color' => '#10B981', 'icon' => 'fa-solid fa-egg'],
            ['name' => 'Menu Anak', 'color' => '#8B5CF6', 'icon' => 'fa-solid fa-baby'],
            ['name' => 'Camilan Ringan', 'color' => '#14B8A6', 'icon' => 'fa-solid fa-cookie'],
            ['name' => 'Makanan Pedas', 'color' => '#DC2626', 'icon' => 'fa-solid fa-pepper-hot'],
            ['name' => 'Menu Nusantara', 'color' => '#F472B6', 'icon' => 'fa-solid fa-utensils'],
            ['name' => 'Makanan Internasional', 'color' => '#60A5FA', 'icon' => 'fa-solid fa-globe'],
            ['name' => 'Vegan / Vegetarian', 'color' => '#22C55E', 'icon' => 'fa-solid fa-seedling'],
            ['name' => 'Kopi', 'color' => '#6B7280', 'icon' => 'fa-solid fa-coffee'],
            ['name' => 'Teh', 'color' => '#A3E635', 'icon' => 'fa-solid fa-leaf'],
            ['name' => 'Mocktail', 'color' => '#F87171', 'icon' => 'fa-solid fa-cocktail'],
            ['name' => 'Smoothie & Juice', 'color' => '#34D399', 'icon' => 'fa-solid fa-blender'],
            ['name' => 'Menu Diet', 'color' => '#4ADE80', 'icon' => 'fa-solid fa-apple-alt'],
            ['name' => 'Fast Food', 'color' => '#F97316', 'icon' => 'fa-solid fa-hamburger'],
            ['name' => 'BBQ & Grill', 'color' => '#7C3AED', 'icon' => 'fa-solid fa-fire'],
            ['name' => 'Sup & Soto', 'color' => '#06B6D4', 'icon' => 'fa-solid fa-utensil-spoon'],
            ['name' => 'Mie & Pasta', 'color' => '#F43F5E', 'icon' => 'fa-solid fa-bacon'],
            ['name' => 'Menu Sehat', 'color' => '#84CC16', 'icon' => 'fa-solid fa-heart-pulse'],
            ['name' => 'Menu Favorit Chef', 'color' => '#E879F9', 'icon' => 'fa-solid fa-hat-chef'],
        ];

        foreach ($categories as $index => $category) {
            DB::table('categories')->insert([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => "Kategori untuk {$category['name']}",
                'icon' => $category['icon'],
                'color' => $category['color'],
                'is_active' => true,
                'sort_order' => $index + 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
