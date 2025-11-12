<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Airport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Http;


class AirportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Airport/Index', [
            'airports' => Airport::paginate(10),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'iata_code' => 'required|string|unique:airports,iata_code|max:3',
            'airport_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'airport_status' => 'required|in:Active,Inactive',
            'timezone' => 'required|string|max:255',
        ]);

        $webhookUrl = env('N8N_AIRPORT_MANAGEMENT_WEBHOOK'); 

        try {
            $response = Http::post($webhookUrl, [
                'iata_code' => $request->iata_code,
                'airport_name' => $request->airport_name,
                'city' => $request->city,
                'country' => $request->country,
                'airport_status' => $request->airport_status,
                'timezone' => $request->timezone,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['webhook' => 'Could not reach registration webhook.']);
        }

        $data = $response->json();

        return redirect()->route('dashboard');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
