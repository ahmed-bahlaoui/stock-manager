<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receives_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Sales User',
            'email' => 'sales@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.email', 'sales@example.com')
            ->assertJsonPath('data.role', User::ROLE_SALES);

        $this->assertNotEmpty($response->json('token'));
        $this->assertDatabaseHas('users', [
            'email' => 'sales@example.com',
            'role' => User::ROLE_SALES,
        ]);
    }

    public function test_user_can_login_and_fetch_profile(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => User::ROLE_ADMIN,
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonPath('data.id', $user->id);

        $token = $loginResponse->json('token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'admin@example.com')
            ->assertJsonPath('data.role', User::ROLE_ADMIN);
    }

    public function test_guest_cannot_access_protected_inventory_route(): void
    {
        $this->getJson('/api/products')->assertUnauthorized();
    }

    public function test_sales_user_cannot_create_category(): void
    {
        Sanctum::actingAs(User::factory()->create([
            'role' => User::ROLE_SALES,
        ]), ['categories:view', 'products:view', 'orders:view', 'orders:create']);

        $this->postJson('/api/categories', [
            'name' => 'Restricted',
            'slug' => 'restricted',
            'description' => 'Should not be allowed',
        ])->assertForbidden();
    }

    public function test_warehouse_user_can_stock_in_but_cannot_create_orders(): void
    {
        $warehouse = User::factory()->create([
            'role' => User::ROLE_WAREHOUSE,
        ]);

        Sanctum::actingAs($warehouse, ['stock:manage', 'stock:view', 'products:view', 'categories:view', 'orders:view']);

        $category = \App\Models\Category::query()->create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'description' => 'Electronic devices',
        ]);

        $product = \App\Models\Product::query()->create([
            'name' => 'Demo Product',
            'sku' => 'AUTH-001',
            'description' => 'Demo description',
            'price' => 99.99,
            'quantity' => 5,
            'min_quantity' => 1,
            'category_id' => $category->id,
        ]);

        $this->postJson('/api/stock-movements/stock-in', [
            'product_id' => $product->id,
            'quantity' => 2,
            'note' => 'Warehouse restock',
        ])->assertCreated();

        $this->postJson('/api/orders', [
            'notes' => 'Warehouse should not create this',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ])->assertForbidden();
    }
}
