<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('shade_name')->nullable();
            $table->string('shade_hex')->nullable();
            $table->string('size_label')->nullable();
            $table->decimal('volume_ml_g', 8, 2)->nullable();
            $table->string('format')->nullable(); // voyage / standard / luxe
            $table->string('sku')->unique();
            $table->decimal('extra_price_mad', 10, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->integer('stock_alert_threshold')->default(10);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
