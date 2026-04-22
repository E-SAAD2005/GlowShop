import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { fetchProducts } from '../lib/api'
import { useCartStore } from '../store/cartStore'
import { Filter, Star, ShoppingBag, Search, ChevronDown, Grid, List as ListIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Boutique() {
  const [filterOpen, setFilterOpen] = useState(false)
  const search = useSearch({ strict: false })
  const [selectedCategory, setSelectedCategory] = useState(search?.category || 'Tous')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  const [sortOpen, setSortOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  // Sync category if URL changes
  useEffect(() => {
    if (search?.category) {
      setSelectedCategory(search.category)
    }
  }, [search?.category])
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, selectedCategory, sortBy],
    queryFn: () => fetchProducts({ 
      page, 
      category: selectedCategory === 'Tous' ? undefined : selectedCategory.toLowerCase().replace(' ', '-'),
      sort: sortBy
    }),
  })

  const addToCart = useCartStore(s => s.addItem)

  const categories = ['Tous', 'Soins Visage', 'Maquillage', 'Cheveux', 'Corps', 'Parfums']

  return (
    <div className="bg-atelier-bg min-h-screen">
      {/* Hero Header */}
      <section className="bg-white border-b border-atelier-border py-20 px-6">
        <div className="container mx-auto text-center">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-atelier-primary italic">L'Édition</h4>
          <h1 className="mt-4 font-serif text-5xl font-bold text-atelier-text md:text-7xl">Boutique</h1>
          <p className="mt-6 mx-auto max-w-xl text-sm leading-relaxed text-atelier-muted">
            Découvrez notre curation exclusive des soins les plus performants au monde. Chaque produit est testé et sélectionné par nos experts.
          </p>
        </div>
      </section>

      {/* Toolbar / Filters */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-atelier-border py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-atelier-text"
            >
              <Filter className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-90' : ''}`} />
              Filtres
            </button>
            <div className="hidden items-center gap-6 md:flex">
              {categories.slice(0, 4).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] uppercase tracking-widest transition-colors ${selectedCategory === cat ? 'text-atelier-primary font-bold border-b border-atelier-primary' : 'text-atelier-muted hover:text-atelier-text'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 border-l border-atelier-border pl-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Affichage:</span>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1 transition-colors ${viewMode === 'grid' ? 'text-atelier-primary' : 'text-atelier-muted hover:text-atelier-text'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1 transition-colors ${viewMode === 'list' ? 'text-atelier-primary' : 'text-atelier-muted hover:text-atelier-text'}`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Trier par:</span>
                  <button 
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-atelier-text hover:text-atelier-primary transition-colors"
                  >
                    {sortBy === 'newest' ? 'Nouveautés' : sortBy === 'price_asc' ? 'Prix croissant' : 'Prix décroissant'} 
                    <ChevronDown className={`h-3 w-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
               </div>
               
               <AnimatePresence>
                 {sortOpen && (
                   <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-48 bg-white border border-atelier-border shadow-atelier z-50 p-2"
                   >
                      {[
                        { label: 'Nouveautés', value: 'newest' },
                        { label: 'Prix croissant', value: 'price_asc' },
                        { label: 'Prix décroissant', value: 'price_desc' }
                      ].map((option) => (
                        <button 
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
                            setSortOpen(false)
                            setPage(1)
                          }}
                          className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${sortBy === option.value ? 'text-atelier-primary bg-atelier-bg' : 'text-atelier-muted hover:text-atelier-text hover:bg-atelier-bg'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] bg-white animate-pulse" />
                    <div className="h-4 w-1/2 bg-white animate-pulse" />
                    <div className="h-4 w-full bg-white animate-pulse" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-20 text-center">
                 <p className="text-atelier-danger-text font-bold uppercase tracking-widest">Une erreur est survenue lors du chargement.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16" 
                : "flex flex-col gap-12"
              }>
                {data?.data?.map((product) => (
                   <div key={product.id} className={`group relative ${viewMode === 'list' ? 'flex flex-col md:flex-row gap-8 items-center bg-white p-6 shadow-sm hover:shadow-md transition-shadow' : ''}`}>
                      <Link to={`/produit/${product.slug}`} className={viewMode === 'list' ? "w-full md:w-64 shrink-0" : "block"}>
                        <div className={`relative overflow-hidden aspect-[3/4] bg-white ${viewMode === 'grid' ? 'shadow-sm' : ''} transition-shadow hover:shadow-xl`}>
                           <img 
                            src={product.main_image_url || `https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600`} 
                            alt={product.name_fr} 
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                           />
                           {product.is_new && <span className="absolute top-4 left-4 bg-atelier-primary text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest z-10">Nouveau</span>}
                        </div>
                      </Link>
 
                      <div className={viewMode === 'grid' ? "mt-6 text-center" : "flex-1 text-left py-4"}>
                         <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-atelier-muted">{product.brand?.name}</p>
                         <Link to={`/produit/${product.slug}`}>
                            <h3 className={`mt-2 font-serif font-bold text-atelier-text hover:text-atelier-primary transition-colors line-clamp-2 ${viewMode === 'grid' ? 'text-lg' : 'text-2xl'}`}>
                              {product.name_fr}
                            </h3>
                         </Link>
                         
                         {viewMode === 'list' && (
                           <p className="mt-4 text-sm text-atelier-muted leading-relaxed line-clamp-3 italic">
                             {product.description_fr}
                           </p>
                         )}

                         <div className={`mt-3 flex items-center gap-1.5 ${viewMode === 'grid' ? 'justify-center' : 'justify-start'}`}>
                            <Star className="h-3 w-3 fill-atelier-primary text-atelier-primary opacity-60" />
                            <Star className="h-3 w-3 fill-atelier-primary text-atelier-primary opacity-60" />
                            <Star className="h-3 w-3 fill-atelier-primary text-atelier-primary opacity-60" />
                            <Star className="h-3 w-3 fill-atelier-primary text-atelier-primary opacity-60" />
                            <Star className="h-3 w-3 text-atelier-primary opacity-30" />
                            <span className="text-[10px] text-atelier-muted ml-0.5">(28 Avis)</span>
                         </div>
                         <p className="mt-4 text-xl font-bold text-atelier-primary">{product.price_mad} MAD</p>
                         
                         {viewMode === 'list' && (
                           <div className="mt-8 flex gap-4">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart({
                                    id: product.id,
                                    variant_id: product.variants?.[0]?.id || product.id,
                                    name: product.name_fr,
                                    price: product.price_mad,
                                    image: product.main_image_url,
                                    quantity: 1
                                  })
                                }}
                                className="bg-atelier-text text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-atelier-primary transition-colors flex items-center gap-2"
                              >
                                <ShoppingBag className="h-4 w-4" />
                                Ajouter au panier
                              </button>
                              <Link 
                                to={`/produit/${product.slug}`}
                                className="border border-atelier-border px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-atelier-bg transition-colors"
                              >
                                Voir détails
                              </Link>
                           </div>
                         )}
                      </div>
 
                      {/* Hover Action (Grid only) */}
                      {viewMode === 'grid' && (
                        <div className="absolute inset-x-4 top-[65%] translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block">
                           <button 
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({
                                id: product.id,
                                variant_id: product.variants?.[0]?.id || product.id,
                                name: product.name_fr,
                                price: product.price_mad,
                                image: product.main_image_url,
                                quantity: 1
                              })
                            }}
                            className="w-full bg-atelier-text text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-atelier-primary transition-colors flex items-center justify-center gap-2"
                           >
                             <ShoppingBag className="h-4 w-4" />
                             Ajouter au panier
                           </button>
                        </div>
                      )}
                      
                      {/* Mobile Action Button (Grid only) */}
                      {viewMode === 'grid' && (
                        <button 
                           onClick={() => addToCart({
                             id: product.id,
                             variant_id: product.variants?.[0]?.id || product.id,
                             name: product.name_fr,
                             price: product.price_mad,
                             image: product.main_image_url,
                             quantity: 1
                           })}
                           className="mt-6 w-full border border-atelier-border py-4 text-[9px] font-bold uppercase tracking-widest md:hidden flex items-center justify-center gap-2"
                        >
                           <ShoppingBag className="h-4 w-4" />
                           Ajouter
                        </button>
                      )}
                   </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-24 border-t border-atelier-border pt-12 flex flex-col items-center gap-8">
               <div className="flex gap-4">
                  {data?.meta?.links?.filter(link => !isNaN(link.label)).map(link => (
                    <button 
                      key={link.label} 
                      onClick={() => setPage(Number(link.label))}
                      className={`h-10 w-10 border text-[11px] font-bold ${link.active ? 'border-atelier-text bg-atelier-text text-white' : 'border-atelier-border text-atelier-muted hover:border-atelier-text hover:text-atelier-text'}`}
                    >
                      {link.label}
                    </button>
                  ))}
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted italic">
                 Affichage de {data?.meta?.from || 0}-{data?.meta?.to || 0} sur {data?.meta?.total || 0} produits
               </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
