<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brand extends Model
{
    protected $fillable = [
        'slug', 'name', 'description_fr', 'description_en', 'logo_path', 'country_origin', 'is_active'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
