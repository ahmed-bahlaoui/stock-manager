<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => User::ROLE_ADMIN,
        ]);

        User::factory()->create([
            'name' => 'Warehouse User',
            'email' => 'warehouse@example.com',
            'role' => User::ROLE_WAREHOUSE,
        ]);

        User::factory()->create([
            'name' => 'Sales User',
            'email' => 'sales@example.com',
            'role' => User::ROLE_SALES,
        ]);

        $this->call([
            InventoryDemoSeeder::class,
        ]);
    }
}
