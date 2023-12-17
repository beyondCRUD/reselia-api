<?php

namespace Database\Seeders;

use Domain\Products\Models\Category;
use Domain\Products\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /** @var Category */
        $sepatu = Category::query()->create(['title' => 'Sepatu']);
        $sepatu->childs()->saveMany([
            new Category(['title' => 'Lifestyle']),
            new Category(['title' => 'Berlari']),
            new Category(['title' => 'Basket']),
            new Category(['title' => 'Sepakbola']),
        ]);

        /** @var Category */
        $pakian = Category::query()->create(['title' => 'Pakaian']);
        $pakian->childs()->saveMany([
            new Category(['title' => 'Jaket']),
            new Category(['title' => 'Hoodie']),
            new Category(['title' => 'Rompi']),
        ]);

        $sepatu1 = Product::query()->create([
            'name' => 'Naik Air Force',
            'model' => 'Sepatu Pria',
            'photo' => 'stub-shoe.jpg',
            'price' => 340_000,
        ]);
        $sepatu2 = Product::query()->create([
            'name' => 'Naik Air Max',
            'model' => 'Sepatu Wanita',
            'photo' => 'stub-shoe.jpg',
            'price' => 420_000,
        ]);
        $sepatu3 = Product::query()->create([
            'name' => 'Naik Air Zoom',
            'model' => 'Sepatu Wanita',
            'photo' => 'stub-shoe.jpg',
            'price' => 360_000,
        ]);

        /** @var Category */
        $sepatuLari = Category::query()->where('title', 'Berlari')->first();
        $sepatuLari->products()->saveMany([$sepatu1, $sepatu2, $sepatu3]);

        /** @var Category */
        $sepatuStyle = Category::query()->where('title', 'Lifestyle')->first();
        $sepatuStyle->products()->saveMany([$sepatu1, $sepatu2]);

        $jaket1 = Product::query()->create([
            'name' => 'Naik Aeroloft Bomber',
            'model' => 'Jaket Wanita',
            'photo' => 'stub-jaket.jpg',
            'price' => 720_000,
        ]);
        $jaket2 = Product::query()->create([
            'name' => 'Naik Guild 550',
            'model' => 'Jaket Pria',
            'photo' => 'stub-jaket.jpg',
            'price' => 380_000,
        ]);
        $jaket3 = Product::query()->create([
            'name' => 'Naik SB Steele',
            'model' => 'Jaket Pria',
            'photo' => 'stub-jaket.jpg',
            'price' => 1_200_000,
        ]);

        /** @var Category */
        $jaket = Category::query()->where('title', 'Jaket')->first();
        $jaket->products()->saveMany([$jaket1, $jaket3]);

        /** @var Category */
        $rompi = Category::query()->where('title', 'Rompi')->first();
        $rompi->products()->saveMany([$jaket2, $jaket3]);
    }
}
