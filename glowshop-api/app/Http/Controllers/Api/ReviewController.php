<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = ProductReview::where('product_id', $productId)
                    ->where('is_approved', true)
                    ->latest()
                    ->get();
        return response()->json($reviews);
    }

    public function store(Request $request, $productId)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'skin_type' => 'nullable|string',
        ]);

        $review = ProductReview::create([
            'product_id' => $productId,
            'user_id' => null, // Mock auth
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? null,
            'content' => $validated['content'],
            'skin_type' => $validated['skin_type'] ?? null,
            'is_verified' => false, 
            'is_approved' => true // Auto-approve for demo
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review
        ], 201);
    }
}
