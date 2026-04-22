<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SkinProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SkinQuizController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'skin_type' => 'required|string',
            'concerns' => 'nullable|array',
            'allergies' => 'nullable|array',
            'age_range' => 'nullable|string',
        ]);

        $sessionToken = $request->header('X-Session-Token', Str::uuid()->toString());

        // Update existing guest profile or create a new one
        $profile = SkinProfile::updateOrCreate(
            ['session_token' => $sessionToken],
            [
                'skin_type' => $validated['skin_type'],
                'concerns' => $validated['concerns'] ?? [],
                'allergies' => $validated['allergies'] ?? [],
                'age_range' => $validated['age_range'] ?? null,
                'user_id' => null, // Mock auth
            ]
        );

        return response()->json([
            'message' => 'Skin profile saved successfully.',
            'session_token' => $sessionToken,
            'profile' => $profile
        ]);
    }

    public function recommendations(Request $request)
    {
        $sessionToken = $request->header('X-Session-Token');
        if (!$sessionToken) {
            return response()->json(['error' => 'No active session token found.'], 400);
        }

        $profile = SkinProfile::where('session_token', $sessionToken)->first();

        if (!$profile) {
            return response()->json(['error' => 'Skin profile not found.'], 404);
        }

        // Extremely naive recommendation logic for MVP: Exact match or "Tous types de peau"
        $query = Product::with(['brand', 'variants'])
            ->where('is_active', true)
            ->where(function ($q) use ($profile) {
                $q->whereJsonContains('skin_types', $profile->skin_type)
                  ->orWhereJsonContains('skin_types', 'Tous types de peau');
            });

        // Exclude specific allergens loosely via tags
        if (!empty($profile->allergies)) {
            $query->withoutTags($profile->allergies);
        }

        // Filter by focus concern if indicated
        if (!empty($profile->concerns)) {
            $query->withAnyTags($profile->concerns);
        }

        return response()->json([
            'profile' => $profile,
            'recommendations' => $query->take(6)->get()
        ]);
    }
}
