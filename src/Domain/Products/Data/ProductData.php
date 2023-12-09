<?php

namespace Domain\Products\Data;

use Illuminate\Support\Carbon;
use Spatie\LaravelData\Data;

class ProductData extends Data
{
    public function __construct(
        public ?string $id,
        public string $name,
        public ?string $photo,
        public string $model,
        public float $price,
        public ?Carbon $created_at,
        public ?Carbon $updated_at,
        public ?Carbon $deleted_at,
    ) {
    }
}
