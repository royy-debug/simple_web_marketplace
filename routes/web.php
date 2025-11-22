<?php

use Illuminate\Support\Facades\Route;

// ===== Landing Pages (pakai landing.blade.php) =====
Route::view('/', 'landing');
Route::view('/products', 'landing');
Route::view('/order/{id}', 'landing')->where('id', '[0-9]+');
Route::view('/orders', 'landing');  // <-- TAMBAH INI


// ===== Auth Pages (pakai app.blade.php) =====
Route::view('/login', 'app');
Route::view('/register', 'app');

// ===== Admin SPA (pakai app.blade.php) =====
Route::view('/admin/{any?}', 'app')->where('any', '.*');