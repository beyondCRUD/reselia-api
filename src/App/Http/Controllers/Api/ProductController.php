<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Domain\Products\Data\ProductData;
use Domain\Products\Models\Product;
use Illuminate\Http\Response;
use Spatie\LaravelData\PaginatedDataCollection;

class ProductController extends Controller
{
    public function __construct(public Product $model) {
        $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return PaginatedDataCollection<array-key, ProductData>
     */
    public function index()
    {
        return ProductData::collection(
            $this->model->query()->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductData $data): ProductData
    {
        $category = $this->model->query()->create(
            $data->toArray()
        );

        return ProductData::from($category);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): ProductData
    {
        return ProductData::from($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductData $data, Product $product): Response
    {
        $attributes = $data->only('name', 'photo', 'model', 'price')->toArray();
        $product->update($attributes);

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): Response
    {
        $product->delete();

        return response()->noContent();
    }
}
