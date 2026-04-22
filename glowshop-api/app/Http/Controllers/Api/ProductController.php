<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['brand', 'category', 'tags', 'variants'])->where('is_active', true);

        // Optional filtering by category
        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Optional sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price_mad', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price_mad', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return response()->json($query->paginate(12));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required_without:name_fr|string|max:255',
            'name_fr'  => 'required_without:name|string|max:255',
            'price'    => 'required_without:price_mad|numeric|min:0',
            'price_mad'=> 'required_without:price|numeric|min:0',
            'category' => 'nullable|string',
            'category_name' => 'nullable|string',
            'stock'    => 'nullable|integer|min:0',
            'image'    => 'nullable|image|max:5120',
            'main_image' => 'nullable|image|max:5120',
        ]);

        $name = $request->input('name', $request->name_fr);
        $price = $request->input('price', $request->price_mad);
        $catName = $request->input('category', $request->category_name);
        $imageKey = $request->hasFile('image') ? 'image' : 'main_image';

        // Resolve category
        $category = null;
        if ($catName) {
            $category = Category::where('name_fr', $catName)->first();
            if (!$category) {
                $category = Category::create([
                    'slug'    => Str::slug($catName),
                    'name_fr' => $catName,
                    'name_en' => $catName,
                    'name_ar' => $catName,
                ]);
            }
        }

        $brand = Brand::firstOrCreate(['slug' => 'the-atelier'], ['name' => 'The Atelier', 'is_active' => true]);
        $slug = Str::slug($name) . '-' . Str::random(5);

        $product = Product::create([
            'name_fr'      => $name,
            'name_en'      => $name,
            'name_ar'      => $name,
            'slug'         => $slug,
            'price_mad'    => $price,
            'category_id'  => $category?->id,
            'brand_id'     => $brand->id,
            'description_fr' => $request->input('description', ''),
            'is_active'    => true,
            'is_featured'  => false,
        ]);

        if ($request->hasFile($imageKey)) {
            $product->addMediaFromRequest($imageKey)->toMediaCollection('gallery');
        }

        return response()->json($product->fresh(['category', 'brand', 'tags', 'variants']), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name_fr'  => 'nullable|string|max:255',
            'price_mad'=> 'nullable|numeric|min:0',
            'category_name' => 'nullable|string',
            'stock'    => 'nullable|integer|min:0',
            'main_image' => 'nullable|image|max:5120',
        ]);

        if ($request->filled('name_fr')) {
            $product->name_fr = $request->name_fr;
            $product->slug = Str::slug($request->name_fr) . '-' . Str::random(5);
        }
        if ($request->filled('price_mad')) {
            $product->price_mad = $request->price_mad;
        }
        if ($request->filled('category_name')) {
            $category = Category::firstOrCreate(
                ['name_fr' => $request->category_name],
                ['slug' => Str::slug($request->category_name), 'name_en' => $request->category_name, 'name_ar' => $request->category_name]
            );
            $product->category_id = $category->id;
        }

        $product->save();

        if ($request->hasFile('main_image')) {
            $product->clearMediaCollection('gallery');
            $product->addMediaFromRequest('main_image')->toMediaCollection('gallery');
        }

        return response()->json($product->fresh(['category', 'brand', 'tags', 'variants']));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function show($slug)
    {
        $product = Product::with(['brand', 'category', 'tags', 'variants'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($product);
    }
}
