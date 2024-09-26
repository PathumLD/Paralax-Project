<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Policies\PostPolicy;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends Controller
{
    use AuthorizesRequests;
    
//     public function index()
// {
//     $posts = Post::with(['user:id,name'])
//         ->withCount('comments')
//         ->where('status', 'published')
//         ->latest()
//         ->paginate(10);

//     return response()->json($posts);
// }

// In your PostController

public function index(Request $request)
{
    $query = Post::with(['user:id,name', 'comments' => function($query) {
        $query->latest();
    }])
    ->withCount('comments')
    ->where('status', 'published');

    // Filter by author if provided
    if ($request->filled('author')) {
        $query->where('user_id', $request->author);
    }

    // Filter by title if provided
    if ($request->filled('title')) {
        $query->where('title', 'like', '%' . $request->title . '%');
    }

    $posts = $query->latest()->get();
    return response()->json($posts);
}



public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'required|string',
        'postStatus' => 'required|in:1,0',
        'status' => 'required|in:published,draft',
    ]);

    // Create the post with specific fields
    $post = $request->user()->posts()->create($request->only(['title', 'body', 'postStatus', 'status']));

    return response()->json($post, 201);
}


public function publicIndex(Request $request)
{
    $query = Post::with(['user:id,name', 'comments' => function ($query) {
        $query->latest();
    }])
    ->withCount('comments');

    // Filter by author if provided
    if ($request->filled('author')) {
        $query->where('user_id', $request->author);
    }

    // Filter by title if provided
    if ($request->filled('title')) {
        $query->where('title', 'like', '%' . $request->title . '%');
    }

    // Execute query and get the posts
    $posts = $query->latest()->get();

    return response()->json($posts);
}


public function show(Post $post)
{
    // Return a specific post with comments and user
    $post->load(['user:id,name', 'comments.user:id,name']);
    return response()->json($post);
}


    // Get posts that belong to the logged-in user
    public function getMyPosts(Request $request)
{
    $user = $request->user();
    $query = Post::where('user_id', $user->id)->withCount('comments')->latest();

    // Filter by title if provided
    if ($request->filled('title')) {
        $query->where('title', 'like', '%' . $request->title . '%');
    }

    // Filter by status if provided
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    $posts = $query->get();

    return response()->json($posts);
}



    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'status' => 'required|in:published,draft',
        ]);

        $post->update($request->all());

        return response()->json($post);
    }

    public function destroy(Post $post)
{
    $this->authorize('delete', $post);

    // Update the postStatus to 0 instead of deleting the post
    $post->update([
        'postStatus' => 0,
    ]);

    return response()->json(['message' => 'Post status updated to deleted.'], 200);
}



public function search(Request $request)
{
    $request->validate([
        'query' => 'required|string|min:3',
        'status' => 'nullable|in:published,draft',
    ]);

    $query = $request->input('query');
    $status = $request->input('status');

    $posts = Post::where('title', 'like', '%' . $query . '%')
                 ->orWhere('body', 'like', '%' . $query . '%');

    if ($status) {
        $posts = $posts->where('status', $status);
    }

    $posts = $posts->with(['user:id,name'])->withCount('comments')->latest()->get();

    return response()->json($posts);
}


public function adminBlogView(Request $request)
    {
        // Authorize that the user is an admin
        $this->authorize('viewAny', Post::class);

        // Fetch all posts, including those with postStatus 0 (deleted) and drafts
        $query = Post::with(['user:id,name', 'comments' => function ($query) {
            $query->latest();
        }])
        ->withCount('comments');

        // Filter by author if provided
        if ($request->filled('author')) {
            $query->where('user_id', $request->author);
        }

        // Filter by title if provided
        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        // Include drafts or deleted posts (postStatus = 0)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->whereIn('status', ['published', 'draft']);
        }

        // Fetch all posts including deleted ones
        $posts = $query->get();

        // Return the posts with a response
        return response()->json($posts);
    }

    public function showAdmin(Post $post)
    {
        // Load the post with user and comments
        $post->load(['user:id,name', 'comments.user:id,name']);
        
        // Return the post data as JSON response
        return response()->json($post);
    }


    public function publish(Post $post)
    {
        $this->authorize('update', $post);  // Ensure the user has permission to update the post

        if ($post->status === 'draft') {
            $post->update(['status' => 'published']);
        }

        return response()->json(['message' => 'Post published successfully.', 'post' => $post], 200);
    }


 



}