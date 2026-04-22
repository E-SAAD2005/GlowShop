<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\Product;
use App\Models\ShippingZone;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function validateCart(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'country_code' => 'nullable|string|size:2',
            'coupon_code' => 'nullable|string'
        ]);

        $subtotal = 0;
        $totalWeight = 0;
        $validatedItems = [];
        $errors = [];

        foreach ($validated['items'] as $item) {
            $variant = ProductVariant::with('product')->find($item['variant_id']);
            
            $variantName = $variant->shade_name ?? $variant->size_label;
            if ($variant->stock < $item['quantity']) {
                $errors[] = "Le stock est insuffisant pour {$variant->product->name_fr} ({$variantName}).";
                continue;
            }

            $price = $variant->product->sale_price_mad ?? $variant->product->price_mad;
            $price += $variant->extra_price_mad;
            $lineTotal = $price * $item['quantity'];
            
            $subtotal += $lineTotal;
            $totalWeight += ($variant->volume_ml_g ?? $variant->product->weight_g ?? 0) * $item['quantity'];
            
            $validatedItems[] = [
                'variant_id' => $variant->id,
                'name' => $variant->product->name_fr,
                'price' => $price,
                'quantity' => $item['quantity'],
                'line_total' => $lineTotal
            ];
        }

        // Calculate Shipping
        $shippingCost = 0;
        $carrier = null;
        if (!empty($validated['country_code'])) {
            $zone = ShippingZone::whereJsonContains('countries', $validated['country_code'])->first();
            if ($zone) {
                if ($zone->free_above_mad && $subtotal >= $zone->free_above_mad) {
                    $shippingCost = 0;
                } else {
                    $weightKg = max(0.5, $totalWeight / 1000); 
                    $shippingCost = $zone->base_cost_mad + ($weightKg * $zone->cost_per_kg_mad);
                }
                $carrier = $zone->carrier;
            } else {
                $errors[] = "La livraison n'est pas disponible pour ce pays.";
            }
        }

        // Mock Discount
        $discount = 0;
        if (!empty($validated['coupon_code']) && $validated['coupon_code'] === 'GLOW10') {
            $discount = $subtotal * 0.10;
        }

        $total = max(0, $subtotal - $discount) + $shippingCost;

        return response()->json([
            'items' => $validatedItems,
            'subtotal_mad' => $subtotal,
            'discount_mad' => $discount,
            'shipping_cost_mad' => $shippingCost,
            'total_mad' => $total,
            'carrier' => $carrier,
            'errors' => $errors
        ]);
    }
}
