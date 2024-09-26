<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Post $post)
    {
        try {
            // Check if the post is active
            if ($post->postStatus === 0) {
                return response()->json(['error' => 'Cannot comment on a deleted post.'], 403);
            }

            $request->validate([
                'body' => 'required|string',
            ]);

            $comment = $post->comments()->create([
                'body' => $request->body,
                'user_id' => $request->user()->id,
            ]);

            return response()->json($comment, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }

    public function update(Request $request, Comment $comment)
    {
        try {
            // Check authorization
            $this->authorize('update', $comment);

            // Validate request
            $request->validate([
                'body' => 'required|string',
            ]);

            // Update the comment
            $comment->body = $request->body;  // This ensures only 'body' is updated
            $comment->save();  // Save the changes

            return response()->json($comment);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Comment $comment)
    {
        try {
            // Check authorization
            $this->authorize('delete', $comment);

            // Delete the comment
            $comment->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
