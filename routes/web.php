<?php

use Illuminate\Support\Facades\Route;

// Landing (non-react)
Route::view('/', 'landing');

// React handles everything else except API
Route::view('/login', 'app');
Route::view('/register', 'app');

// Admin SPA
Route::view('/admin/{any?}', 'app')->where('any', '.*');

// User SPA
Route::view('/{any}', 'app')->where('any', '^(?!api).*$');
