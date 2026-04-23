<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMovementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product' => $this->product ? [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'sku' => $this->product->sku,
                'category' => $this->product->category ? [
                    'id' => $this->product->category->id,
                    'name' => $this->product->category->name,
                    'slug' => $this->product->category->slug,
                ] : null,
            ] : null,
            'order_id' => $this->order_id,
            'order_number' => $this->order?->order_number,
            'type' => $this->type,
            'quantity' => $this->quantity,
            'note' => $this->note,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
