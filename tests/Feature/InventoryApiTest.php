<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_stock_in_increases_product_quantity(): void
    {
        $product = $this->createProduct(quantity: 10);

        $response = $this->postJson('/api/stock-movements/stock-in', [
            'product_id' => $product->id,
            'quantity' => 5,
            'note' => 'Restock shipment',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.type', 'stock_in')
            ->assertJsonPath('data.quantity', 5);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'quantity' => 15,
        ]);
    }

    public function test_order_creation_decreases_stock_and_creates_order_records(): void
    {
        $product = $this->createProduct(quantity: 10, price: 299.99, sku: 'KBD-001');

        $response = $this->postJson('/api/orders', [
            'notes' => 'Customer order',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 3,
                ],
            ],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonPath('data.items.0.product_id', $product->id)
            ->assertJsonPath('data.items.0.quantity', 3)
            ->assertJsonPath('data.stock_movements.0.type', 'stock_out');

        $orderId = $response->json('data.id');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'quantity' => 7,
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'completed',
            'notes' => 'Customer order',
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $orderId,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);
    }

    public function test_insufficient_stock_returns_validation_error_and_rolls_back_order_creation(): void
    {
        $product = $this->createProduct(quantity: 4, sku: 'MOU-001');

        $response = $this->postJson('/api/orders', [
            'notes' => 'Too large order',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 999,
                ],
            ],
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['items']);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'quantity' => 4,
        ]);

        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseCount('order_items', 0);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_stock_movements_are_recorded_for_stock_in_and_stock_out(): void
    {
        $product = $this->createProduct(quantity: 8, sku: 'CAB-001');

        $this->postJson('/api/stock-movements/stock-in', [
            'product_id' => $product->id,
            'quantity' => 4,
            'note' => 'Supplier delivery',
        ])->assertCreated();

        $orderResponse = $this->postJson('/api/orders', [
            'notes' => 'Movement audit order',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 5,
                ],
            ],
        ])->assertCreated();

        $orderId = $orderResponse->json('data.id');

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'order_id' => null,
            'type' => 'stock_in',
            'quantity' => 4,
            'note' => 'Supplier delivery',
        ]);

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'order_id' => $orderId,
            'type' => 'stock_out',
            'quantity' => 5,
        ]);

        $this->assertEquals(2, StockMovement::query()->count());
        $this->assertEquals(7, Product::query()->findOrFail($product->id)->quantity);
    }

    private function createProduct(
        int $quantity,
        float $price = 99.99,
        string $sku = 'SKU-001',
    ): Product {
        $category = Category::query()->create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'description' => 'Electronic devices',
        ]);

        return Product::query()->create([
            'name' => 'Demo Product',
            'sku' => $sku,
            'description' => 'Demo description',
            'price' => $price,
            'quantity' => $quantity,
            'min_quantity' => 2,
            'category_id' => $category->id,
        ]);
    }
}
