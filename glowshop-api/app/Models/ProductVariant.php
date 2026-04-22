<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'shade_name', 'shade_hex', 'size_label',
        'volume_ml_g', 'format', 'sku', 'extra_price_mad', 'stock', 'stock_alert_threshold'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
