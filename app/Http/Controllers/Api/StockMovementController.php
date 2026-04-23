<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockInRequest;
use App\Http\Resources\StockMovementResource;
use App\Models\StockMovement;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StockMovementController extends Controller
{
    public function __construct(
        private readonly StockService $stockService,
    ) {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $movements = StockMovement::query()
            ->with(['product.category', 'order'])
            ->when($request->integer('product_id'), function ($query, int $productId) {
                $query->where('product_id', $productId);
            })
            ->when($request->integer('order_id'), function ($query, int $orderId) {
                $query->where('order_id', $orderId);
            })
            ->when($request->string('type')->toString(), function ($query, string $type) {
                $query->where('type', $type);
            })
            ->latest()
            ->paginate(15);

        return StockMovementResource::collection($movements);
    }

    public function show(StockMovement $stockMovement): StockMovementResource
    {
        return new StockMovementResource($stockMovement->load(['product.category', 'order']));
    }

    public function stockIn(StockInRequest $request): JsonResponse
    {
        $movement = $this->stockService->stockIn($request->validated());

        return response()->json([
            'message' => 'Stock received successfully.',
            'data' => new StockMovementResource($movement->load(['product.category', 'order'])),
        ], 201);
    }
}
