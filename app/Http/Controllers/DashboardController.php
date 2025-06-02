<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function allPosts()
    {
        return Inertia::render('dashboard', [
            'postsWithUserData' => Post::with('user')->latest()->get(),
        ]);
    }
}
