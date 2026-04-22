import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { CartDrawer } from './cart/CartDrawer'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { Search, User, ShoppingBag, Globe, Menu, X, ArrowRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchProducts } from '../lib/api'
import { useQuery } from '@tanstack/react-query'

export function Layout() {
  const { isCartOpen, openCart, closeCart } = useCartStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const getItemCount = useCartStore(s => s.getItemCount)
  const itemCount = getItemCount()
  
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const { data: products } = useQuery({
    queryKey: ['products-search'],
    queryFn: fetchProducts,
    enabled: searchOpen
  })

  const filteredProducts = products?.data?.filter(p => 
    p.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4)

  const handleUserClick = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate({ to: '/admin' })
      } else {
        navigate({ to: '/mon-compte' })
      }
    } else {
      navigate({ to: '/login' })
    }
  }

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false)
    setSearchQuery('')
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="container mx-auto px-6 h-32 flex items-center justify-between">
               <span className="font-serif text-3xl font-bold">GlowShop</span>
               <button onClick={() => setSearchOpen(false)} className="p-4 hover:rotate-90 transition-transform">
                  <X className="h-8 w-8 text-atelier-muted" />
               </button>
            </div>
            
            <div className="container mx-auto px-6 mt-12 flex-1">
               <div className="max-w-4xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-atelier-primary mb-6 italic">Quelles pépites cherchez-vous ?</p>
                  <div className="relative group">
                     <input 
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Marque, produit ou ingrédient..." 
                      className="w-full text-5xl md:text-7xl font-serif font-bold border-none outline-none placeholder:text-atelier-border"
                     />
                     <div className="absolute -bottom-4 left-0 w-0 h-1 bg-atelier-primary group-focus-within:w-full transition-all duration-700" />
                  </div>

                  <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted border-b border-atelier-border pb-4 mb-8">Suggestions populaires</h4>
                        <div className="flex flex-wrap gap-4">
                           {['Baume Nettoyant', 'Vitamine C', 'Peaux sensibles', 'Serum Purifiant'].map(s => (
                             <button onClick={() => setSearchQuery(s)} key={s} className="px-6 py-3 bg-atelier-bg text-[11px] font-bold uppercase tracking-widest hover:bg-atelier-primary hover:text-white transition-all">
                               {s}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted border-b border-atelier-border pb-4 mb-8">Résultat correspondant</h4>
                        <div className="space-y-6">
                           {searchQuery && filteredProducts?.map(p => (
                             <Link key={p.id} to={`/produit/${p.slug}`} className="flex items-center gap-6 group">
                                <div className="h-20 w-16 bg-atelier-bg p-2 overflow-hidden border border-atelier-border">
                                   <img src={p.main_image_url} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-atelier-muted">{p.brand.name}</p>
                                   <p className="text-sm font-bold text-atelier-text group-hover:text-atelier-primary transition-colors">{p.name_fr}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 ml-auto text-atelier-border group-hover:text-atelier-primary opacity-0 group-hover:opacity-100 transition-all" />
                             </Link>
                           ))}
                           {!searchQuery && <p className="text-xs italic text-atelier-muted">Commencez à taper pour voir les résultats.</p>}
                           {searchQuery && filteredProducts?.length === 0 && <p className="text-xs italic text-atelier-muted">Aucun produit trouvé pour "{searchQuery}".</p>}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-atelier-bg border-b border-atelier-border py-1.5 text-center text-[10px] uppercase tracking-widest text-atelier-muted">
        {isAuthenticated ? `Ravie de vous revoir, ${user.name}` : 'Livraison offerte à partir de 400 MAD'}
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-atelier-border bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center px-6">
          <Link to="/" className="flex-shrink-0">
            <span className="font-serif text-3xl font-bold tracking-tight text-atelier-text">GlowShop</span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center space-x-10 text-[11px] font-semibold uppercase tracking-[0.2em] md:flex">
            <Link to="/boutique" search={{ category: 'Soins Visage' }} className="transition-colors hover:text-atelier-primary active:scale-95">Soins</Link>
            <Link to="/boutique" search={{ category: 'Maquillage' }} className="transition-colors hover:text-atelier-primary active:scale-95">Maquillage</Link>
            <Link to="/boutique" search={{ category: 'Cheveux' }} className="transition-colors hover:text-atelier-primary active:scale-95">Cheveux</Link>
            <Link to="/skin-quiz" className="text-atelier-primary transition-colors hover:text-atelier-primary-hover active:scale-95 font-bold">Skin Quiz</Link>
          </nav>

          <div className="flex items-center space-x-6">
            <div className="hidden items-center space-x-1 text-[11px] font-medium uppercase tracking-wider text-atelier-muted lg:flex">
              <span>MAD</span>
              <span className="mx-1 h-3 w-[1px] bg-atelier-border"></span>
              <span>FR</span>
            </div>
            
            <button onClick={() => setSearchOpen(true)} className="text-atelier-text transition-colors hover:text-atelier-primary">
              <Search className="h-5 w-5 stroke-[1.5]" />
            </button>
            <button 
              onClick={handleUserClick}
              className={`text-atelier-text transition-colors hover:text-atelier-primary ${isAuthenticated ? 'text-atelier-primary' : ''}`}
            >
              <User className="h-5 w-5 stroke-[1.5]" />
            </button>
            <button
              onClick={() => openCart()}
              className="group relative flex items-center gap-1 text-atelier-text transition-colors hover:text-atelier-primary"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-atelier-primary text-[9px] font-bold text-white transition-transform group-hover:scale-110">
                  {itemCount}
                </span>
              )}
            </button>
            <button className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onClose={() => closeCart()} />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-atelier-border bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-4 lg:gap-24">
            <div>
              <h3 className="font-serif text-2xl font-bold text-atelier-text">GlowShop</h3>
              <p className="mt-6 text-sm leading-relaxed text-atelier-muted max-w-xs">
                L’édition des meilleurs soins au monde, sélectionnés pour leur efficacité et leur pureté.
              </p>
            </div>
            
            <div>
               <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-atelier-text">Navigation</h4>
               <ul className="mt-8 space-y-4 text-sm text-atelier-muted font-medium">
                <li><Link to="/boutique" className="hover:text-atelier-primary transition-colors">Boutique</Link></li>
                <li><Link to="/skin-quiz" className="hover:text-atelier-primary transition-colors">Skin Quiz</Link></li>
                <li><Link to="/" className="hover:text-atelier-primary transition-colors">Marques</Link></li>
                <li><Link to="/admin" className="text-xs italic text-atelier-muted/50 hover:text-atelier-primary">Accès Admin</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-atelier-text">Aide</h4>
              <ul className="mt-8 space-y-4 text-sm text-atelier-muted font-medium">
                <li><span className="hover:text-atelier-primary transition-colors cursor-pointer">Livraison & Retours</span></li>
                <li><span className="hover:text-atelier-primary transition-colors cursor-pointer">FAQ</span></li>
                <li><span className="hover:text-atelier-primary transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-atelier-text">Infolettre</h4>
              <form className="mt-8 flex flex-col space-y-4">
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="bg-[#FAF7F4] border-b border-atelier-border py-2 text-sm focus:border-atelier-primary focus:outline-none transition-colors"
                />
                <button className="bg-atelier-primary text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-atelier-primary-hover transition-colors">S’abonner</button>
              </form>
            </div>
          </div>
          
          <div className="mt-20 flex flex-col items-center justify-between border-t border-atelier-border pt-10 md:flex-row">
            <p className="text-[10px] uppercase tracking-widest text-atelier-muted">
              © 2026 GlowShop. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
