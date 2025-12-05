<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PreferencesController extends Controller
{
    /**
     * Display the authenticated user's preferences.
     */
    public function show()
    {
        $preferences = auth()->user()->preferences;

        if ($preferences === null) {
            return response()->json([
                'budget' => null,
                'preferred_location' => null,
                'cleanliness_level' => null,
                'lifestyle' => null,
                'sleeping_schedule' => null,
                'pet_friendly' => null,
                'smoking' => null,
                'drinking' => null,
                'hobbies' => null,
            ]);
        }

        return response()->json($preferences);
    }

    /**
     * Update the authenticated user's preferences.
     */
    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'budget' => ['nullable', 'integer'],
            'preferred_location' => ['nullable', 'string'],
            'cleanliness_level' => ['nullable', 'integer', 'min:1', 'max:5'],
            'lifestyle' => ['nullable', 'string', 'in:introvert,extrovert,mixed'],
            'sleeping_schedule' => ['nullable', 'string', 'in:early_bird,night_owl'],
            'pet_friendly' => ['nullable', 'boolean'],
            'smoking' => ['nullable', 'boolean'],
            'drinking' => ['nullable', 'boolean'],
            'hobbies' => ['nullable', 'string'],
        ]);

        $user = auth()->user();

        $preferences = $user->preferences()->updateOrCreate(
            ['user_id' => $user->id],
            $validatedData
        );

        return response()->json($preferences);
    }
}

