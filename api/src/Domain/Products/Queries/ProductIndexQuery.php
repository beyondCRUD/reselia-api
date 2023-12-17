<?php

namespace Domain\Products\Queries;

use Domain\Products\Models\Product;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class ProductIndexQuery extends QueryBuilder
{
    public function __construct(Request $request)
    {
        $query = Product::query();

        parent::__construct($query, $request);

        $fields = ['id', 'name', 'photo', 'model', 'price'];

        $this->allowedSorts($fields);
        $this->allowedFilters($fields);
    }
}
