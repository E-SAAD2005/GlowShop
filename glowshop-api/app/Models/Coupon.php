<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = ['code', 'type', 'value', 'min_order_mad', 'uses_limit', 'uses_count', 'starts_at', 'expires_at', 'is_active'];
    protected $casts = ['starts_at' => 'datetime', 'expires_at' => 'datetime'];
}
