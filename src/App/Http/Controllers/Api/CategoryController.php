<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Domain\Products\Actions\CreateCategoryAction;
use Domain\Products\Data\CategoryData;
use Domain\Products\Models\Category;
use Illuminate\Http\Response;
use Spatie\LaravelData\PaginatedDataCollection;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return PaginatedDataCollection<array-key, CategoryData>
     */
    public function index()
    {
        return CategoryData::collection(Category::query()->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryData $data): CategoryData
    {
        $category = Category::query()->create($data->toArray());

        return CategoryData::from($category);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): CategoryData
    {
        return CategoryData::from($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryData $data, Category $category): CategoryData
    {
        $category->update($data->toArray());

        return CategoryData::from($category->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): Response
    {
        $category->delete();

        return response()->noContent();
    }
}
