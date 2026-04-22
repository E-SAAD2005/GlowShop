import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, Star } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../lib/api'

export function Home() {
  const addItem = useCartStore(s => s.addItem)
  
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchProducts,
  })

  const [toast, setToast] = useState({ show: false, message: '' })

  const showMagazineMessage = () => {
    setToast({ show: true, message: 'Le magazine Atelier sera bientôt disponible !' })
    setTimeout(() => setToast({ show: false, message: '' }), 4000)
  }

  // We can just use the first 4 products for the Best Sellers section
  const bestSellers = productsData?.data?.slice(0, 4) || []

  return (
    <div className="bg-atelier-bg">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=2000" 
            alt="Beauty Lifestyle" 
            className="h-full w-full object-cover object-center brightness-[0.95]"
          />
        </div>
        
        <div className="container relative z-10 mx-auto flex h-full items-center px-6">
          <div className="max-w-2xl text-white md:text-atelier-text">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-5xl font-bold leading-tight md:text-7xl lg:text-8xl"
            >
              Révélez votre <br /> 
              <span className="italic font-normal">éclat naturel</span>
            </motion.h1>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/boutique" className="group flex items-center gap-4 bg-atelier-primary px-10 py-5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-atelier-primary-hover active:scale-95">
                Découvrir la collection
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/boutique" className="flex items-center gap-4 border border-white px-10 py-5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-atelier-text active:scale-95 md:border-atelier-text md:text-atelier-text">
                Best Sellers
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy / Features Bar */}
      <div className="bg-[#F2EFED] py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-10 md:justify-between lg:gap-20">
            {[
              { label: 'VEGAN & CLEAN', img: '🌿' },
              { label: 'CRUELTY-FREE', img: '🐰' },
              { label: 'MAISON MAROCAINE', img: '🇲🇦' },
              { label: 'TESTÉ DERMATOLOGIQUEMENT', img: '🔬' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-muted">
                <span className="text-lg">{feature.img}</span>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Les Collections Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-atelier-primary">Magazine</h4>
            <h2 className="mt-4 font-serif text-4xl font-bold md:text-6xl">Les Collections</h2>
          </div>
          <Link to="/boutique" className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:text-atelier-primary transition-colors">
            Voir tout <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Featured Category */}
          <div className="relative overflow-hidden lg:col-span-7 aspect-[4/5] md:aspect-auto md:h-[700px]">
            <img 
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200" 
              alt="Soins Visage" 
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/40 to-transparent text-white">
              <h3 className="font-serif text-4xl font-bold">Soins Visage</h3>
              <p className="mt-4 text-sm font-medium tracking-wide">L'équilibre parfait entre science et nature.</p>
              <Link to="/boutique" className="mt-8 inline-block text-[10px] font-bold uppercase tracking-[0.2em] underline underline-offset-8 transition-colors hover:text-atelier-primary-light">Explorer</Link>
            </div>
          </div>

          {/* Secondary Grids */}
          <div className="space-y-12 lg:col-span-5">
            <div className="relative overflow-hidden aspect-square h-[326px] w-full ml-auto">
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800" 
                alt="Maquillage" 
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity hover:opacity-100 opacity-60">
                 <h3 className="font-serif text-3xl font-bold text-white italic">Maquillage</h3>
              </div>
              <Link to="/boutique" className="absolute inset-0 z-10" />
            </div>

            <div className="relative overflow-hidden aspect-square h-[326px] w-full">
               <img 
                src="https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&q=80&w=800" 
                alt="Cheveux" 
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity hover:opacity-100 opacity-60">
                 <h3 className="font-serif text-3xl font-bold text-white italic">Bien-être</h3>
              </div>
              <Link to="/boutique" className="absolute inset-0 z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Carrousel Placeholder */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <h2 className="font-serif text-4xl font-bold md:text-6xl">Best Sellers</h2>
            <div className="flex items-center gap-6">
               <Link to="/boutique" className="group hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:text-atelier-primary transition-colors">
                 Voir tout <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              <div className="col-span-4 py-20 flex justify-center">
                <div className="h-8 w-8 border-4 border-atelier-primary/30 border-t-atelier-primary rounded-full animate-spin" />
              </div>
            ) : bestSellers.length > 0 ? (
              bestSellers.map((p, i) => (
                <div key={p.id || i} className="group cursor-pointer">
                  <div className="relative overflow-hidden aspect-[3/4] bg-atelier-bg rounded-sm">
                    <Link to={`/produit/${p.slug}`} className="block h-full w-full">
                      {!!p.is_featured && <span className="absolute left-4 top-4 bg-atelier-primary px-2 py-1 text-[8px] font-bold text-white uppercase tracking-widest z-10">Sélection</span>}
                      <img src={p.main_image_url} alt={p.name_fr} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addItem({
                          id: p.id,
                          variant_id: p.id,
                          name: p.name_fr,
                          price: parseFloat(p.price_mad),
                          image: p.main_image_url,
                          quantity: 1
                        })
                      }}
                      className="absolute inset-x-4 bottom-4 translate-y-8 bg-white py-3 text-[10px] font-bold uppercase tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:bg-atelier-text hover:text-white z-20"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                  <Link to={`/produit/${p.slug}`} className="mt-6 text-center block">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">{p.brand?.name || 'The Atelier'}</span>
                    <h3 className="mt-1 font-medium text-atelier-text truncate">{p.name_fr}</h3>
                    <div className="mt-2 flex items-center justify-center space-x-2 text-xs">
                      <div className="flex text-yellow-500">
                         <Star className="h-3 w-3 fill-current" />
                         <Star className="h-3 w-3 fill-current" />
                         <Star className="h-3 w-3 fill-current" />
                         <Star className="h-3 w-3 fill-current" />
                         <Star className="h-3 w-3 fill-current" />
                      </div>
                      <span className="text-atelier-muted">({Math.floor(Math.random() * 100) + 10})</span>
                    </div>
                    <p className="mt-2 font-bold text-atelier-primary">{parseFloat(p.price_mad).toFixed(2)} MAD</p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-4 py-20 text-center text-atelier-muted">
                Aucun produit trouvé.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Routine Banner */}
      <section className="container mx-auto px-6 py-32">
        <div className="relative overflow-hidden rounded-sm bg-[#EFE3DB] p-12 md:p-24 lg:flex lg:items-center">
           <div className="relative z-10 lg:w-1/2">
              <h2 className="font-serif text-4xl font-bold md:text-6xl text-atelier-text">Trouvez votre <br /> <span className="italic font-normal">routine parfaite</span></h2>
              <p className="mt-8 max-w-md text-atelier-muted leading-relaxed">
                Chaque peau est unique. Répondez à notre diagnostic de 2 minutes pour recevoir une sélection personnalisée de soins adaptés à vos besoins spécifiques.
              </p>
              <Link to="/skin-quiz" className="mt-10 inline-block bg-atelier-primary px-10 py-5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-atelier-primary-hover active:scale-95">
                Commencer le diagnostic
              </Link>
           </div>
           
           <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full bg-atelier-primary-light/30 blur-3xl" />
                <img 
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800" 
                  alt="Liquid Texture" 
                  className="relative z-10 h-full w-full object-contain overflow-visible mask-radial"
                />
              </div>
           </div>
        </div>
      </section>

      {/* Secrets de Beauté (Blog) */}
      <section className="container mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-atelier-primary italic">Le Mag</h4>
          <h2 className="mt-4 font-serif text-4xl font-bold md:text-6xl">Secrets de Beauté</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: '5 gestes pour un teint éclatant dès le réveil', category: 'Routine Matinale', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800' },
            { title: 'L’Acide Hyaluronique : Tout savoir sur son action', category: 'Ingrédients', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800' },
            { title: 'Pourquoi passer à la cosmétique solide ?', category: 'Tendance', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800' }
          ].map((blog, i) => (
              <button 
                key={i} 
                onClick={showMagazineMessage}
                className="group cursor-pointer text-left w-full"
             >
                <div className="overflow-hidden aspect-video bg-atelier-border">
                  <img src={blog.img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="mt-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-atelier-primary">{blog.category}</span>
                  <h3 className="mt-4 font-serif text-xl font-bold text-atelier-text leading-tight group-hover:text-atelier-primary transition-colors">{blog.title}</h3>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Lire l'article</p>
                </div>
             </button>
          ))}
        </div>
      </section>
      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-atelier-text text-white px-8 py-5 shadow-2xl flex items-center gap-4 min-w-[320px]"
          >
            <div className="h-2 w-2 rounded-full bg-atelier-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: '' })} className="ml-auto hover:rotate-90 transition-transform">
               <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
