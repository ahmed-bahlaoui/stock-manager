<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        private readonly StockService $stockService,
    ) {
    }

    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $products = Product::query()
                ->whereIn('id', collect($data['items'])->pluck('product_id'))
                ->get()
                ->keyBy('id');

            $order = Order::query()->create([
                'order_number' => $this->generateOrderNumber(),
                'status' => 'completed',
                'total_amount' => 0,
                'notes' => $data['notes'] ?? null,
            ]);

            $totalAmount = 0;

            foreach ($data['items'] as $item) {
                $product = $products->get($item['product_id']);
                $quantity = (int) $item['quantity'];
                $unitPrice = (string) $product->price;
                $subtotal = bcmul($unitPrice, (string) $quantity, 2);

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ]);

                $this->stockService->stockOut(
                    product: $product,
                    quantity: $quantity,
                    orderId: $order->id,
                    note: "Order {$order->order_number}"
                );

                $totalAmount = bcadd((string) $totalAmount, $subtotal, 2);
            }

            $order->update([
                'total_amount' => $totalAmount,
            ]);

            return $order->fresh(['items', 'stockMovements']);
        });
    }

    private function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'ORD-'.Str::upper(Str::random(10));
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}
