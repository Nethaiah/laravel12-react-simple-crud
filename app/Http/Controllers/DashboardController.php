<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Posts;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function allPosts()
    {
        return Inertia::render('dashboard', [
            'postsWithUserData' => Posts::with('user')->latest()->get(),
        ]);
    }
}
