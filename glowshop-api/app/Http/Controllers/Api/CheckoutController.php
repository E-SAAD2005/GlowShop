<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        // Extrait simpliste du validateur, on s'appuierait en temps normal sur le CartController pour valider.
        $validated = $request->validate([
            'items' => 'required|array',
            'shipping_country' => 'required|string',
            'total_mad' => 'required|numeric',
            'shipping_cost_mad' => 'required|numeric',
            'carrier' => 'required|string',
        ]);

        $order = Order::create([
            'order_ref' => 'GLW-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'total_mad' => $validated['total_mad'],
            'shipping_cost_mad' => $validated['shipping_cost_mad'],
            'shipping_country' => $validated['shipping_country'],
            'carrier' => $validated['carrier'],
            'payment_method' => 'card', // mocked
        ]);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_variant_id' => $item['variant_id'],
                'product_name' => $item['name'] ?? 'Produit',
                'quantity' => $item['quantity'],
                'unit_price_mad' => $item['price'] ?? 0,
                'total_mad' => ($item['price'] ?? 0) * $item['quantity']
            ]);
        }

        return response()->json([
            'message' => 'Order created successfully',
            'order_ref' => $order->order_ref
        ], 201);
    }
}
