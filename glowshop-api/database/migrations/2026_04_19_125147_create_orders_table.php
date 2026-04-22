<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_ref')->unique();
            $table->string('status'); // pending, paid, shipped, cancelled
            $table->decimal('total_mad', 10, 2);
            $table->string('currency')->default('MAD');
            $table->decimal('discount_mad', 10, 2)->default(0);
            $table->integer('glowpoints_used')->default(0);
            $table->decimal('shipping_cost_mad', 10, 2);
            $table->string('carrier')->nullable();
            $table->string('shipping_country');
            $table->string('payment_method')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
