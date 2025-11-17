<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Airline;

class AirlineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $search = $request->query('search');

        $airlines = Airline::when($search, function ($query) use ($search) {
                $query->where('airline_name', 'like', "%{$search}%")
                    ->orWhere('airline_code', 'like', "%{$search}%")
                    ->orWhere('callsign', 'like', "%{$search}%")
                    ->orWhere('country', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString(); // keep ?search= in pagination

        return Inertia::render('Airline/Index', [
            'airlines' => $airlines,
            'filters' => [
                'search' => $search,
            ],
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
        //
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
