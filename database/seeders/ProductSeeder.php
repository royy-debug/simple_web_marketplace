<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil 100 produk dari DummyJSON
        $response = Http::get('https://dummyjson.com/products?limit=100')->json();

        if (!isset($response['products'])) {
            dd('Gagal fetch API. Cek koneksi atau endpoint.');
        }

        foreach ($response['products'] as $item) {

            // 1. Simpan kategori jika belum ada
            $category = Category::firstOrCreate([
                'name' => $item['category'],
            ]);

            // 2. Simpan produk
            Product::create([
                'name'        => $item['title'],
                'categories_id' => $category->id,
                'price'       => $item['price'],
                'stock'       => rand(5, 100), // stok random
                'image'       => $item['thumbnail'],
                'description' => $item['description'],
            ]);
        }

        echo "Selesai import 100 produk dari DummyJSON.\n";
    }
}
