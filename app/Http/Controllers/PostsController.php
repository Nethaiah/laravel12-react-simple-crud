<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use JonPurvis\Squeaky\Rules\Clean;

class PostsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('posts/index', [
            'posts' => Posts::where('user_id', Auth::id())->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:25', new Clean],
            'body' => ['required', 'string', 'max:255', new Clean],
        ]);

        $post = Posts::create([
            'title' => $request->title,
            'body' => $request->body,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('posts.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Posts $posts)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Posts $posts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Posts $post)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:25', new Clean],
            'body' => ['required', 'string', 'max:255', new Clean],
        ]);

        $post->update([
            'title' => $request->title,
            'body' => $request->body,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('posts.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Posts $post)
    {
        $post->delete();

        return redirect()->route('posts.index');
    }
}
