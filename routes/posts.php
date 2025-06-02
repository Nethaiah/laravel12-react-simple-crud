<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('posts', PostsController::class);
    Route::get('dashboard', [DashboardController::class, 'allPosts'])->name('dashboard');
});
