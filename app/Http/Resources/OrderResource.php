<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'notes' => $this->notes,
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product?->name,
                    'product_sku' => $item->product?->sku,
                    'category' => $item->product?->category ? [
                        'id' => $item->product->category->id,
                        'name' => $item->product->category->name,
                        'slug' => $item->product->category->slug,
                    ] : null,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                ];
            })->values(),
            'stock_movements' => $this->stockMovements->map(function ($movement) {
                return [
                    'id' => $movement->id,
                    'product_id' => $movement->product_id,
                    'type' => $movement->type,
                    'quantity' => $movement->quantity,
                    'note' => $movement->note,
                    'created_at' => $movement->created_at,
                ];
            })->values(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
