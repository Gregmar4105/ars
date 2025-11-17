<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AirlineController;
use App\Http\Controllers\AircraftController;
use App\Http\Controllers\AirportController;
use App\Http\Controllers\SeatController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ReceiptController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified', 'prevent-back'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');   

    Route::resource('bookings', BookingController::class);
    Route::resource('seats', SeatController::class);
    Route::resource('airports', AirportController::class);
    Route::resource('airlines', AirlineController::class);
    Route::resource('aircrafts', AircraftController::class);
    Route::resource('tickets', TicketController::class);
    Route::resource('receipts', ReceiptController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
