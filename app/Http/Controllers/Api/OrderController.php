<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->with(['items.product.category', 'stockMovements'])
            ->latest()
            ->paginate(15);

        return OrderResource::collection($orders);
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order->load(['items.product.category', 'stockMovements']));
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->create($request->validated());

        return response()->json([
            'message' => 'Order created successfully.',
            'data' => new OrderResource($order->load(['items.product.category', 'stockMovements'])),
        ], 201);
    }
}
