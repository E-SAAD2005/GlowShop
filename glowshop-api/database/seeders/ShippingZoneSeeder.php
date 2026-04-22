<?php
namespace Database\Seeders;

use App\Models\ShippingZone;
use Illuminate\Database\Seeder;

class ShippingZoneSeeder extends Seeder
{
    public function run(): void
    {
        ShippingZone::create([
            'zone_name' => 'Maroc',
            'countries' => ['MA'],
            'carrier' => 'Amana',
            'base_cost_mad' => 45.00,
            'cost_per_kg_mad' => 0.00,
            'free_above_mad' => 400.00,
            'delivery_days_min' => 2,
            'delivery_days_max' => 5
        ]);

        ShippingZone::create([
            'zone_name' => 'Europe',
            'countries' => ['FR', 'ES', 'BE', 'IT', 'DE', 'NL'],
            'carrier' => 'DHL Express',
            'base_cost_mad' => 250.00,
            'cost_per_kg_mad' => 50.00,
            'free_above_mad' => 1500.00,
            'delivery_days_min' => 5,
            'delivery_days_max' => 10
        ]);
    }
}
