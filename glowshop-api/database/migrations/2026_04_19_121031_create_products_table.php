<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->string('name_fr');
            $table->string('name_ar')->nullable();
            $table->string('name_en')->nullable();
            $table->text('description_fr')->nullable();
            $table->text('description_en')->nullable();
            $table->json('skin_types')->nullable();
            $table->json('certifications')->nullable();
            $table->text('inci_list')->nullable();
            $table->text('how_to_use_fr')->nullable();
            $table->decimal('price_mad', 10, 2);
            $table->decimal('sale_price_mad', 10, 2)->nullable();
            $table->integer('dlc_months')->nullable();
            $table->decimal('weight_g', 8, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
