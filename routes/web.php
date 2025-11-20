<?php

use Illuminate\Support\Facades\Route;

// Landing Page
Route::get('/', function () {
    return view('landing');
});

// Login & Register pages
Route::get('/login', function () {
    return view('app');
});

Route::get('/register', function () {
    return view('app');
});

// Admin pages
Route::get('/admin/{any?}', function () {
    return view('app');
})->where('any', '.*');
