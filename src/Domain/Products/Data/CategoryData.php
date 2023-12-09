<?php

namespace Domain\Products\Data;

use Domain\Products\Models\Category;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class CategoryData extends Data
{
    public function __construct(
        public string|Optional $id,
        public string $title,
        #[Exists('categories', 'id')]
        public string|Optional|null $parent_id,
    ) {
    }

    public static function fromModel(Category $category): self
    {
        return new self(
            $category->id,
            $category->title,
            $category->parent_id,
        );
    }

    /** @return array<mixed> */
    public function with(): array
    {
        return ['endpoints' => []];
    }
}
