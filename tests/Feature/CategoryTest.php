<?php

use App\Models\User;
use Domain\Products\Models\Category;
use Illuminate\Support\Facades\Auth;

use function Pest\Laravel\artisan;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

it('can create a category', function () {
    $postEndpoint = '/api/v1/categories';
    $user = User::factory()->create();

    Auth::login($user);

    $title = fake()->name();
    $postRequest = postJson($postEndpoint, ['title' => $title]);
    $category = $postRequest->json();

    expect($postRequest->getStatusCode())->toBe(201);
    expect($category)->title->toBe($title);

    $title = fake()->name();
    $postRequest = postJson($postEndpoint, ['title' => $title, 'parent_id' => $category['id']]);
    $json = $postRequest->json();

    expect($postRequest->getStatusCode())->toBe(201);
    expect($json)
        ->title->toBe($title)
        ->parent_id->toBe($category['id']);

    $title = fake()->name();
    $postRequest = postJson($postEndpoint, [
        'title' => $title,
        'parent_id' => $category['id'] . 'wrong_id',
    ]);

    expect($postRequest->getStatusCode())->toBe(422);

    expect(Category::all()->count())->toBe(2);
});

it('can get categories with pagination', function () {
    artisan('db:seed');

    $getRequest = getJson('api/v1/categories');

    expect($getRequest->getStatusCode())->toBe(200);

    $data = $getRequest->json('data');

    expect($data)->toHaveCount(9);

    $meta = $getRequest->json('meta');

    expect($meta)
        ->current_page->toBe(1)
        ->from->toBe(1)
        ->last_page->toBe(1)
        ->next_page_url->toBe(null)
        ->per_page->toBe(15)
        ->prev_page_url->toBe(null)
        ->to->toBe(9)
        ->total->toBe(9)
    ;
});

it('can get category', function () {
    artisan('db:seed');

    $category = Category::query()->first();

    $getRequest = getJson('api/v1/categories/wrong_id'.$category->id);

    expect($getRequest->getStatusCode())->toBe(404);

    $getRequest = getJson('api/v1/categories/'.$category->id);

    expect($getRequest->getStatusCode())
        ->toBe(200)
        ->and($getRequest->json())
        ->id->toBe($category->id)
        ->title->toBe($category->title)
        ->parent_id->toBe($category->parent_id)
    ;
});

it('can update a category', function () {
    artisan('db:seed');

    $user = User::factory()->create();

    Auth::login($user);

    $category = Category::query()->first();

    $putRequest = putJson('/api/v1/categories/wrong_id'.$category->id);

    expect($putRequest->getStatusCode())->toBe(404);

    $putRequest = putJson('/api/v1/categories/'.$category->id);

    expect($putRequest->getStatusCode())
        ->toBe(422)
        ->and($putRequest->json())
        ->toBeArray()
        ->and($putRequest->json('errors'))->title->toBeArray();

    $putRequest = putJson('/api/v1/categories/'.$category->id, [
        'title' => 'Updated title',
    ]);

    expect($putRequest->getStatusCode())->toBe(204);
});

it('can delete a category', function () {
    artisan('db:seed');

    $user = User::factory()->create();

    Auth::login($user);

    $category = Category::query()->first();

    $putRequest = deleteJson('/api/v1/categories/wrong_id'.$category->id);

    expect($putRequest->getStatusCode())->toBe(404);

    $putRequest = deleteJson('/api/v1/categories/'.$category->id);

    expect($putRequest->getStatusCode())->toBe(204);
});
