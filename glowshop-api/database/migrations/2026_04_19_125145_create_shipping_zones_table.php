<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_zones', function (Blueprint $table) {
            $table->id();
            $table->string('zone_name');
            $table->json('countries');
            $table->string('carrier');
            $table->decimal('base_cost_mad', 10, 2);
            $table->decimal('cost_per_kg_mad', 10, 2)->default(0);
            $table->decimal('free_above_mad', 10, 2)->nullable();
            $table->integer('delivery_days_min');
            $table->integer('delivery_days_max');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_zones');
    }
};
