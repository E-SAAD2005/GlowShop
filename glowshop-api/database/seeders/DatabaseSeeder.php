<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $soinsVisage = Category::create([
            'slug' => 'soins-visage',
            'name_fr' => 'Soins Visage',
            'name_ar' => 'العناية بالوجه',
            'name_en' => 'Face Care'
        ]);

        $maquillage = Category::create([
            'slug' => 'maquillage',
            'name_fr' => 'Maquillage',
            'name_ar' => 'مكياج',
            'name_en' => 'Makeup'
        ]);

        // 2. Brands
        $brandCeraVe = Brand::create([
            'slug' => 'cerave',
            'name' => 'CeraVe',
            'description_fr' => 'Développé avec des dermatologues.',
            'country_origin' => 'USA'
        ]);

        $brandRareBeauty = Brand::create([
            'slug' => 'rare-beauty',
            'name' => 'Rare Beauty',
            'description_fr' => 'Créé par Selena Gomez. Vegan & Cruelty-free.',
            'country_origin' => 'USA'
        ]);

        $brandLaneige = Brand::create([
            'slug' => 'laneige',
            'name' => 'Laneige',
            'description_fr' => 'Spécialiste de l\'hydratation.',
            'country_origin' => 'Corée du Sud'
        ]);

        $brandTheOrdinary = Brand::create([
            'slug' => 'the-ordinary',
            'name' => 'The Ordinary',
            'description_fr' => 'Formulations cliniques avec intégrité.',
            'country_origin' => 'Canada'
        ]);

        // 3. Products
        $cleanser = Product::create([
            'slug' => 'cerave-hydrating-cleanser',
            'category_id' => $soinsVisage->id,
            'brand_id' => $brandCeraVe->id,
            'name_fr' => 'Crème Lavante Hydratante',
            'description_fr' => 'Nettoie et hydrate sans altérer la barrière protectrice de la peau. Contient 3 céramides essentiels et de l\'acide hyaluronique.',
            'skin_types' => ['Normale', 'Sèche', 'Sensible'],
            'certifications' => ['Sans Parfum', 'Non comédogène'],
            'price_mad' => 129.00,
            'is_active' => true,
            'is_featured' => true
        ]);
        
        $cleanser->attachTags(['Acide Hyaluronique', 'Céramides']);

        $blush = Product::create([
            'slug' => 'soft-pinch-liquid-blush',
            'category_id' => $maquillage->id,
            'brand_id' => $brandRareBeauty->id,
            'name_fr' => 'Soft Pinch Liquid Blush',
            'description_fr' => 'Un fard à joues liquide léger et longue tenue qui se fond parfaitement pour donner aux joues un éclat sain et plein de douceur.',
            'skin_types' => ['Tous types de peau'],
            'certifications' => ['Vegan', 'Cruelty-Free'],
            'price_mad' => 280.00,
            'is_active' => true,
            'is_featured' => true
        ]);
        
        $blush->attachTags(['Pigmenté', 'Longue tenue']);

        $mask = Product::create([
            'slug' => 'laneige-lip-sleeping-mask',
            'category_id' => $soinsVisage->id,
            'brand_id' => $brandLaneige->id,
            'name_fr' => 'Lip Sleeping Mask',
            'description_fr' => 'Un masque de nuit pour les lèvres qui apaise et hydrate pour des lèvres plus lisses et plus souples.',
            'skin_types' => ['Tous types de peau'],
            'certifications' => ['Hydratation intense'],
            'price_mad' => 240.00,
            'is_active' => true,
            'is_featured' => true
        ]);

        $niacinamide = Product::create([
            'slug' => 'the-ordinary-niacinamide',
            'category_id' => $soinsVisage->id,
            'brand_id' => $brandTheOrdinary->id,
            'name_fr' => 'Niacinamide 10% + Zinc 1%',
            'description_fr' => 'Une formule de vitamines et de minéraux à haute teneur pour lutter contre les imperfections et la congestion cutanée.',
            'skin_types' => ['Grasse', 'Mixte'],
            'certifications' => ['Vegan', 'Sans Huile'],
            'price_mad' => 120.00,
            'is_active' => true,
            'is_featured' => true
        ]);

        // 4. Variants
        ProductVariant::create([
            'product_id' => $cleanser->id,
            'size_label' => '236 ml',
            'volume_ml_g' => 236,
            'sku' => 'CRV-HYD-236',
            'stock' => 50,
        ]);

        ProductVariant::create([
            'product_id' => $blush->id,
            'shade_name' => 'Hope',
            'shade_hex' => '#df999d',
            'sku' => 'RB-BLUSH-HOPE',
            'stock' => 25,
        ]);

        ProductVariant::create([
            'product_id' => $mask->id,
            'size_label' => '20g',
            'volume_ml_g' => 20,
            'sku' => 'LAN-LIP-20',
            'stock' => 30,
        ]);

        ProductVariant::create([
            'product_id' => $niacinamide->id,
            'size_label' => '30 ml',
            'volume_ml_g' => 30,
            'sku' => 'TO-NIA-30',
            'stock' => 100,
        ]);
    }
}
