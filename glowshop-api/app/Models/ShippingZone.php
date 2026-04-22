<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    protected $fillable = ['zone_name', 'countries', 'carrier', 'base_cost_mad', 'cost_per_kg_mad', 'free_above_mad', 'delivery_days_min', 'delivery_days_max'];

    protected $casts = [
        'countries' => 'array',
    ];
}
