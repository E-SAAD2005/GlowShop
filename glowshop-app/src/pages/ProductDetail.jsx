import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from '@tanstack/react-router'
import { fetchProduct } from '../lib/api'
import { ReviewsList } from '../components/product/ReviewsList'
import { useCartStore } from '../store/cartStore'
import { Star, ShoppingBag, Heart, ChevronRight, Share2, Info, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export function ProductDetail() {
  const { slug } = useParams({ strict: false })
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Le Produit')
  const [isFavorite, setIsFavorite] = useState(false)
  
  const addItem = useCartStore(s => s.addItem)
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
    onSuccess: (data) => {
      if (data.variants?.length > 0) {
        setSelectedVariant(data.variants[0])
      }
    }
  })

  if (isLoading) return (
    <div className="container mx-auto px-6 py-24 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="aspect-square bg-white animate-pulse" />
        <div className="space-y-6">
          <div className="h-4 w-1/4 bg-white animate-pulse" />
          <div className="h-10 w-3/4 bg-white animate-pulse" />
          <div className="h-20 w-full bg-white animate-pulse" />
        </div>
      </div>
    </div>
  )
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold">Produit introuvable</h2>
        <Link to="/boutique" className="mt-8 inline-block text-[10px] font-bold uppercase tracking-widest text-atelier-primary hover:underline">Retour à la boutique</Link>
      </div>
    )
  }

  const currentVariant = selectedVariant || product.variants?.[0]
  const price = Number(product.sale_price_mad ?? product.price_mad) + (currentVariant?.extra_price_mad || 0)

  return (
    <div className="bg-atelier-bg min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-atelier-muted">
           <Link to="/" className="hover:text-atelier-primary transition-colors">Accueil</Link>
           <ChevronRight className="h-3 w-3" />
           <Link to="/boutique" className="hover:text-atelier-primary transition-colors">Boutique</Link>
           <ChevronRight className="h-3 w-3" />
           <span className="text-atelier-text">{product.name_fr}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Gallery Sidebar / Main Image */}
          <div className="lg:col-span-1 hidden lg:flex flex-col gap-4">
             {[1,2,3].map(i => (
               <button key={i} className="aspect-square border border-atelier-border bg-white hover:border-atelier-primary transition-colors p-2">
                 <img src={product.main_image_url} className="w-full h-full object-contain" />
               </button>
             ))}
          </div>

          <div className="lg:col-span-6">
             <div className="aspect-square bg-white border border-atelier-border shadow-atelier flex items-center justify-center p-12 overflow-hidden group">
                <img 
                  src={product.main_image_url} 
                  className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110" 
                  alt={product.name_fr} 
                />
             </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-atelier-primary italic">{product.brand?.name}</p>
                <h1 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-atelier-text leading-tight">{product.name_fr}</h1>
              </div>
              <button className="p-3 border border-atelier-border rounded-full hover:bg-white transition-colors">
                <Share2 className="h-4 w-4 text-atelier-muted" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex text-atelier-primary">
                {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-current' : 'opacity-30'}`} />)}
              </div>
              <span className="text-xs font-bold text-atelier-muted uppercase tracking-widest">(42 Avis)</span>
            </div>

            <p className="mt-8 text-3xl font-serif font-bold text-atelier-text">{price} MAD</p>

            <div className="mt-10 space-y-8">
               {/* Description Snippet */}
               <p className="text-sm text-atelier-muted leading-relaxed italic">
                 "{product.description_fr?.substring(0, 150)}..."
               </p>

               {/* Variant Selection */}
               {product.variants?.length > 0 && (
                 <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-atelier-text">Teinte / Taille: <span className="font-normal text-atelier-muted">{currentVariant?.shade_name || currentVariant?.size_label}</span></p>
                    <div className="flex flex-wrap gap-3">
                       {product.variants.map((variant) => (
                         <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`group relative h-12 min-w-[3rem] px-2 border ${
                            selectedVariant?.id === variant.id ? 'border-atelier-primary p-0.5' : 'border-atelier-border p-1'
                          } transition-all hover:scale-105 active:scale-95 flex items-center justify-center bg-white`}
                         >
                            {variant.shade_hex ? (
                              <div 
                                className="w-8 h-8 border border-black/5" 
                                style={{ backgroundColor: variant.shade_hex }}
                              />
                            ) : (
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2">
                                {variant.size_label || variant.shade_name}
                              </span>
                            )}
                            {selectedVariant?.id === variant.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-atelier-primary/10">
                                 <Check className="h-4 w-4 text-atelier-primary" />
                              </div>
                            )}
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {/* Quantity & Add to Cart */}
               <div className="pt-8 border-t border-atelier-border space-y-6">
                  <div className="flex items-center gap-6">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Quantité</span>
                     <div className="flex items-center border border-atelier-border bg-white overflow-hidden">
                        <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="px-4 py-2 hover:bg-atelier-bg">-</button>
                        <span className="px-6 py-2 text-xs font-bold">{quantity}</span>
                        <button onClick={() => setQuantity(quantity+1)} className="px-4 py-2 hover:bg-atelier-bg">+</button>
                     </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        addItem({
                          id: product.id,
                          variant_id: currentVariant?.id || product.id,
                          name: product.name_fr,
                          price: price,
                          image: product.main_image_url,
                          quantity: quantity,
                          shade: currentVariant?.shade_name || null
                        })
                      }}
                      className="flex-1 bg-atelier-primary text-white py-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-atelier-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Ajouter au panier
                    </button>
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`px-6 border border-atelier-border hover:bg-white transition-all ${isFavorite ? 'bg-atelier-primary text-white border-atelier-primary' : 'hover:text-atelier-primary'}`}
                    >
                       <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
               </div>
            </div>

            {/* Commitments & Shipping Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { label: 'Livraison 48h', sub: 'Gratuite dès 400MAD' },
                 { label: 'Clean Beauty', sub: 'Certifié sans parabènes' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-4 bg-white/50 border border-atelier-border rounded-sm">
                    <div className="h-2 w-2 rounded-full bg-atelier-primary" />
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-atelier-text">{item.label}</p>
                       <p className="text-[9px] text-atelier-muted uppercase">{item.sub}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Product Tabs (Story, Ingredients, Usage) */}
        <div className="mt-32 border-t border-atelier-border">
           <div className="flex justify-center border-b border-atelier-border">
              {['Le Produit', 'Ingrédients', 'Usage'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'border-b-2 border-atelier-primary text-atelier-primary' : 'text-atelier-muted hover:text-atelier-text'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
           <div className="py-16 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                 <div className="col-span-1">
                    {activeTab === 'Le Produit' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="font-serif text-3xl font-bold text-atelier-text italic mb-6 leading-tight">L'équilibre parfait <br /> pour votre peau.</h3>
                        <p className="text-sm leading-relaxed text-atelier-muted mb-8">
                           {product.description_fr}
                        </p>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 text-xs font-bold text-atelier-text uppercase tracking-widest">
                              <Check className="h-4 w-4 text-green-600" /> Testé sous contrôle dermatologique
                           </div>
                           <div className="flex items-center gap-4 text-xs font-bold text-atelier-text uppercase tracking-widest">
                              <Check className="h-4 w-4 text-green-600" /> Non comédogène
                           </div>
                        </div>
                      </motion.div>
                    )}
                    {activeTab === 'Ingrédients' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="font-serif text-3xl font-bold text-atelier-text italic mb-6 leading-tight">Composition & <br /> Ingrédients.</h3>
                        <p className="text-sm leading-relaxed text-atelier-muted mb-8 font-mono bg-white p-6 border border-atelier-border">
                           {product.inci_list || "Liste des ingrédients non disponible pour le moment."}
                        </p>
                      </motion.div>
                    )}
                    {activeTab === 'Usage' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="font-serif text-3xl font-bold text-atelier-text italic mb-6 leading-tight">Conseils <br /> d'utilisation.</h3>
                        <div className="text-sm leading-relaxed text-atelier-muted mb-8 space-y-4">
                           {product.how_to_use_fr ? (
                             <p className="whitespace-pre-line">{product.how_to_use_fr}</p>
                           ) : (
                             <p>Appliquer délicatement sur une peau propre matin et soir.</p>
                           )}
                        </div>
                      </motion.div>
                    )}
                 </div>
                 <div className="col-span-1 relative">
                    <div className="absolute -inset-4 bg-atelier-primary/5 rounded-sm blur-2xl" />
                    <img src={product.main_image_url} className="relative z-10 w-full h-80 object-contain mix-blend-multiply" />
                 </div>
              </div>
           </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewsList productId={product.id} />
        </div>
      </div>
    </div>
  )
}
