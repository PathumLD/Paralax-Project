<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;



Route::post('admin/register', [AdminController::class, 'register']);
Route::post('admin/login', [AdminController::class, 'login']);
Route::middleware('auth:sanctum')->post('admin/logout', [AdminController::class, 'logout']);



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public', [PostController::class, 'publicIndex']);
Route::get('/user-count', [AuthController::class, 'getUserCount']);
Route::get('/admin/posts/{post}', [PostController::class, 'showAdmin']);



// Protect routes using Sanctum middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('posts', PostController::class);
    Route::get('/posts/search', [PostController::class, 'search']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/public', [PostController::class, 'publicIndex']);
    Route::get('/my-posts', [PostController::class, 'getMyPosts']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::put('/posts/{post}/publish', [PostController::class, 'publish']);

    
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::get('/posts/{post}/get-comments', [CommentController::class, 'getComments']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});