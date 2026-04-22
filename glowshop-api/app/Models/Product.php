<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Tags\HasTags;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia, HasTags;

    protected $fillable = [
        'slug', 'category_id', 'brand_id', 'name_fr', 'name_ar', 'name_en',
        'description_fr', 'description_en', 'skin_types', 'certifications',
        'inci_list', 'how_to_use_fr', 'price_mad', 'sale_price_mad',
        'dlc_months', 'weight_g', 'is_active', 'is_featured'
    ];

    protected $appends = ['main_image_url'];

    protected $casts = [
        'skin_types' => 'array',
        'certifications' => 'array',
    ];

    public function getMainImageUrlAttribute()
    {
        // Try to get from media library
        $media = $this->getFirstMediaUrl('gallery');
        if ($media) return $media;

        // Fallback placeholder based on product slug for demo
        $fallbacks = [
            'cerave-hydrating-cleanser' => 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
            'soft-pinch-liquid-blush' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800',
            'laneige-lip-sleeping-mask' => 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800',
            'the-ordinary-niacinamide' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
        ];

        return $fallbacks[$this->slug] ?? "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800";
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gallery')
             ->useDisk('public'); // Default local storage for images, can be switched to cloudinary later
    }
}
