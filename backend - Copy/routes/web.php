<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

Route::get('/', function () {
    return view('welcome');
});

// Fallback route to serve storage files if storage:link is missing
Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);

    if (!File::exists($fullPath)) {
        abort(404);
    }

    $file = File::get($fullPath);
    $type = File::mimeType($fullPath);

    return Response::make($file, 200)->header("Content-Type", $type);
})->where('path', '.*');
