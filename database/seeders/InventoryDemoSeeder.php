<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class InventoryDemoSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic devices and accessories.',
            ],
            [
                'name' => 'Office',
                'slug' => 'office',
                'description' => 'Office supplies and workspace essentials.',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Add-ons and small everyday accessories.',
            ],
        ])->mapWithKeys(function (array $category) {
            $model = Category::query()->create($category);

            return [$model->slug => $model];
        });

        $products = [
            [
                'category_slug' => 'electronics',
                'name' => 'Wireless Keyboard',
                'sku' => 'KBD-001',
                'description' => '2.4G wireless keyboard.',
                'price' => 299.99,
                'quantity' => 100,
                'min_quantity' => 10,
                'note' => 'Initial warehouse stock',
            ],
            [
                'category_slug' => 'electronics',
                'name' => 'Wireless Mouse',
                'sku' => 'MOU-001',
                'description' => 'Ergonomic wireless mouse.',
                'price' => 149.99,
                'quantity' => 80,
                'min_quantity' => 8,
                'note' => 'Initial warehouse stock',
            ],
            [
                'category_slug' => 'office',
                'name' => 'Office Chair',
                'sku' => 'CHR-001',
                'description' => 'Adjustable office chair.',
                'price' => 1299.00,
                'quantity' => 20,
                'min_quantity' => 5,
                'note' => 'Initial warehouse stock',
            ],
            [
                'category_slug' => 'accessories',
                'name' => 'USB-C Cable',
                'sku' => 'CAB-001',
                'description' => '1 meter USB-C fast charging cable.',
                'price' => 89.50,
                'quantity' => 150,
                'min_quantity' => 20,
                'note' => 'Initial warehouse stock',
            ],
            [
                'category_slug' => 'accessories',
                'name' => 'Laptop Stand',
                'sku' => 'STD-001',
                'description' => 'Aluminum adjustable laptop stand.',
                'price' => 349.00,
                'quantity' => 35,
                'min_quantity' => 6,
                'note' => 'Initial warehouse stock',
            ],
        ];

        foreach ($products as $productData) {
            $category = $categories->get($productData['category_slug']);

            $product = Product::query()->create([
                'name' => $productData['name'],
                'sku' => $productData['sku'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'quantity' => $productData['quantity'],
                'min_quantity' => $productData['min_quantity'],
                'category_id' => $category->id,
            ]);

            StockMovement::query()->create([
                'product_id' => $product->id,
                'order_id' => null,
                'type' => 'stock_in',
                'quantity' => $productData['quantity'],
                'note' => $productData['note'],
            ]);
        }
    }
}
