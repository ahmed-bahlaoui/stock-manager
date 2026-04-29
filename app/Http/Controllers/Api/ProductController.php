<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Product::class);

        $products = Product::query()
            ->with('category')
            ->latest()
            ->paginate(15);

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $this->authorize('create', Product::class);

        $product = Product::query()->create($request->validated());

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product->load('category')),
        ], 201);
    }

    public function show(Product $product): ProductResource
    {
        $this->authorize('view', $product);

        return new ProductResource($product->load('category'));
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);

        $product->update($request->validated());

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product->load('category')),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }
}
