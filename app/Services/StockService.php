<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class StockService
{
    public function stockIn(array $data): StockMovement
    {
        return DB::transaction(function () use ($data) {
            $product = Product::query()->lockForUpdate()->findOrFail($data['product_id']);

            $product->increment('quantity', $data['quantity']);

            return StockMovement::query()->create([
                'product_id' => $product->id,
                'order_id' => null,
                'type' => 'stock_in',
                'quantity' => $data['quantity'],
                'note' => $data['note'] ?? null,
            ]);
        });
    }

    public function stockOut(Product $product, int $quantity, ?int $orderId = null, ?string $note = null): StockMovement
    {
        if ($quantity < 1) {
            throw new RuntimeException('Stock out quantity must be at least 1.');
        }

        $lockedProduct = Product::query()->lockForUpdate()->findOrFail($product->id);

        if ($lockedProduct->quantity < $quantity) {
            throw ValidationException::withMessages([
                'items' => ["Insufficient stock for product {$lockedProduct->sku}."],
            ]);
        }

        $lockedProduct->decrement('quantity', $quantity);

        return StockMovement::query()->create([
            'product_id' => $lockedProduct->id,
            'order_id' => $orderId,
            'type' => 'stock_out',
            'quantity' => $quantity,
            'note' => $note,
        ]);
    }
}
