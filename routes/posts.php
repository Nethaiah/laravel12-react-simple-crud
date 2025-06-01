<?php

use App\Http\Controllers\PostsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::resource('posts', PostsController::class);
});
