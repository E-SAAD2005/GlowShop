<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = ['user_id', 'order_ref', 'status', 'total_mad', 'currency', 'discount_mad', 'glowpoints_used', 'shipping_cost_mad', 'carrier', 'shipping_country', 'payment_method'];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
