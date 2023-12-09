<?php

namespace Domain\Products\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    protected $fillable = ['name', 'model', 'photo', 'price'];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }
}
