<?php

use App\Models\User;
use Domain\Products\Models\Product;
use Illuminate\Support\Facades\Auth;

use function Pest\Laravel\artisan;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

it('can create a product', function () {
    $postEndpoint = '/api/v1/products';
    $user = User::factory()->create();

    Auth::login($user);

    $name = 'Naik Air Max';
    $postRequest = postJson($postEndpoint, ['name' => $name]);

    expect($postRequest->getStatusCode())
        ->toBe(422)
        ->and($postRequest->json())
        ->toHaveKeys(['message', 'errors'])
        ->and($postRequest->json('message'))
        ->toContain('required')
        ->and($postRequest->json('errors'))
        ->toBeArray();

    $attributes = [
        'name' => $name,
        'model' => 'Sepatu Pria',
        'photo' => 'stub-shoe.jpg',
        'price' => 340_000,
    ];

    $postRequest = postJson($postEndpoint, $attributes);

    expect($postRequest->getStatusCode())
        ->toBe(201)
        ->and($postRequest->json())
        ->toHaveKeys(['id', 'name', 'photo', 'model', 'price', 'created_at', 'updated_at', 'deleted_at'])
        ->and($postRequest->json())
        ->toMatchArray($attributes)
        ->and(Product::all()->count())
        ->toBe(1);
});

it('can get products with pagination', function () {
    artisan('db:seed');

    $getRequest = getJson('api/v1/products');

    expect($getRequest->getStatusCode())
        ->toBe(200)
        ->and($getRequest->json())
        ->toHaveKeys(['data', 'links', 'meta'])
        ->and($getRequest->json('data'))
        ->toHaveCount(6)
        ->and($getRequest->json('meta'))
        ->current_page->toBe(1)
        ->from->toBe(1)
        ->last_page->toBe(1)
        ->next_page_url->toBe(null)
        ->per_page->toBe(15)
        ->prev_page_url->toBe(null)
        ->to->toBe(6)
        ->total->toBe(6);
});

it('can show product', function () {
    artisan('db:seed');

    $product = Product::query()->first();

    $getRequest = getJson('api/v1/products/wrong_id'.$product->id);

    expect($getRequest->getStatusCode())->toBe(404);

    $getRequest = getJson('api/v1/products/'.$product->id);
    $attributes = $product->only('id', 'name', 'photo', 'model', 'price');

    expect($getRequest->getStatusCode())
        ->toBe(200)
        ->and($getRequest->json())
        ->toMatchArray($attributes);
});

it('can update a product', function () {
    artisan('db:seed');

    $user = User::factory()->create();

    Auth::login($user);

    $product = Product::query()->first();

    $putRequest = putJson('/api/v1/products/wrong_id'.$product->id);

    expect($putRequest->getStatusCode())->toBe(404);

    $putRequest = putJson('/api/v1/products/'.$product->id);

    expect($putRequest->getStatusCode())
        ->toBe(422)
        ->and($putRequest->json())
        ->toHaveKeys(['message', 'errors'])
        ->and($putRequest->json('message'))
        ->toContain('required')
        ->and($putRequest->json('errors'))
        ->toBeArray();

    $putRequest = putJson('/api/v1/products/'.$product->id, [
        'name' => 'Updated',
        'model' => 'Updated',
        'price' => 100_00,
    ]);

    expect($putRequest->getStatusCode())->toBe(204);
});

it('can delete a product', function () {
    artisan('db:seed');

    $user = User::factory()->create();

    Auth::login($user);

    $category = Product::query()->first();

    $putRequest = deleteJson('/api/v1/products/wrong_id'.$category->id);

    expect($putRequest->getStatusCode())->toBe(404);

    $putRequest = deleteJson('/api/v1/products/'.$category->id);

    expect($putRequest->getStatusCode())->toBe(204);
});

it('can sorting product', function (string $column) {
    artisan('db:seed');

    $product = Product::query()->orderBy($column, 'desc')->first();

    $getRequest = getJson('api/v1/products?sort=-'.$column);

    expect($getRequest->getStatusCode())
        ->toBe(200)
        ->and($getRequest->json())
        ->toHaveKeys(['data', 'links', 'meta'])
        ->and($getRequest->json('data.0.name'))
        ->toBe($product->name);
})->with(['name', 'model', 'photo', 'price']);

it('can filtering product', function (string $column, string $value) {
    artisan('db:seed');

    $product = Product::query()->where($column, $value)->first();

    $getRequest = getJson('api/v1/products?filter['.$column.']='.$value);

    expect($getRequest->getStatusCode())
        ->toBe(200)
        ->and($getRequest->json())
        ->toHaveKeys(['data', 'links', 'meta'])
        ->and($getRequest->json('data.0.name'))
        ->toBe($product->name);
})->with([
    ['column' => 'name', 'value' => 'Naik SB Steele'],
    ['column' => 'model', 'value' => 'Jaket Wanita'],
    ['column' => 'photo', 'value' => 'stub-jaket.jpg'],
    ['column' => 'price', 'value' => '720000'],
]);
