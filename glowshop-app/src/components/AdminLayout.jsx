import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Search, 
  Bell, 
  HelpCircle, 
  Plus, 
  LogOut,
  Settings,
  ChevronRight,
  Menu,
  Star,
  X,
  FolderPlus,
  ArrowRight,
  Check
} from 'lucide-react'

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState('menu') // 'menu' | 'collection'
  const [collectionName, setCollectionName] = useState('')
  const [collectionSeason, setCollectionSeason] = useState('Printemps 2025')
  const [collectionSaved, setCollectionSaved] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Product Catalog', path: '/admin/catalog', icon: Package },
    { label: 'Order Flow', path: '/admin/orders', icon: Truck },
    { label: 'Clientele', path: '/admin/clientele', icon: Users },
    { label: 'Promotions', path: '/admin/promotions', icon: Star },
    { label: 'Brand Analytics', path: '/admin/analytics', icon: BarChart3 },
  ]

  const notifications = [
    { id: 1, title: 'Nouvelle commande #GLW-1025', time: 'Il y a 5 min', unread: true },
    { id: 2, title: 'Stock faible: Sérum Rose Botanique', time: 'Il y a 2h', unread: true },
    { id: 3, title: 'Nouveau client inscrit', time: 'Hier', unread: false },
    { id: 4, title: 'Paiement reçu — 1,250 MAD', time: 'Hier', unread: false },
  ]

  const handleOpenModal = () => {
    setModalView('menu')
    setCollectionName('')
    setCollectionSaved(false)
    setShowModal(true)
  }

  const handleSaveCollection = () => {
    if (!collectionName.trim()) return
    setCollectionSaved(true)
    setTimeout(() => {
      setShowModal(false)
      setCollectionSaved(false)
    }, 1500)
  }

  const handleGoToCatalog = () => {
    setShowModal(false)
    navigate({ to: '/admin/catalog' })
  }

  return (
    <div className="flex h-screen bg-[#FAF7F4] font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 border-r border-atelier-border bg-[#F2EFED] flex flex-col transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 flex justify-between items-center">
          <Link to="/" className="group" onClick={() => setSidebarOpen(false)}>
            <h1 className="font-serif text-2xl font-bold text-atelier-primary tracking-tight">The Atelier</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-atelier-muted mt-1 font-bold">Product Management</p>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
             <X className="h-5 w-5 text-atelier-muted" />
          </button>
        </div>

        <div className="mt-8 flex-1 px-6 space-y-2">
           <button 
            onClick={handleOpenModal}
            className="w-full bg-atelier-primary px-6 py-4 rounded-sm flex items-center gap-4 text-white hover:bg-atelier-primary-hover transition-colors shadow-lg active:scale-95 mb-10"
           >
              <Plus className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">New Collection</span>
           </button>

           <nav className="space-y-1">
             {navItems.map((item) => {
               const isActive = location.pathname === item.path
               return (
                 <Link 
                   key={item.path}
                   to={item.path}
                   onClick={() => setSidebarOpen(false)}
                   className={`flex items-center gap-4 px-6 py-4 rounded-sm transition-all duration-300 group ${
                     isActive 
                       ? 'text-atelier-primary bg-white shadow-atelier translate-x-1' 
                       : 'text-atelier-muted hover:text-atelier-primary hover:bg-white/50'
                   }`}
                 >
                   <item.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                   <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                     {item.label}
                   </span>
                   {isActive && <div className="ml-auto w-1 h-6 bg-atelier-primary rounded-full" />}
                 </Link>
               )
             })}
           </nav>
        </div>

        {/* User Profile */}
        <div className="p-8 border-t border-atelier-border bg-white/30">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-sm overflow-hidden bg-atelier-primary flex items-center justify-center text-white font-bold uppercase">
               {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-atelier-text">{user?.name || 'Admin'}</p>
              <p className="text-[9px] text-atelier-muted uppercase tracking-widest">{user?.role || 'Senior Manager'}</p>
            </div>
            <button 
              onClick={() => {
                if (window.confirm('Voulez-vous vous déconnecter ?')) logout()
              }}
              className="ml-auto text-atelier-muted hover:text-atelier-primary transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-atelier-border flex items-center px-6 lg:px-10 gap-4 lg:gap-8 relative z-20">
           <button onClick={() => setSidebarOpen(true)} className="text-atelier-muted lg:hidden p-2 hover:bg-atelier-bg rounded-sm transition-colors">
             <Menu className="h-6 w-6" />
           </button>
           
           <h2 className="font-serif text-[18px] font-bold text-atelier-primary tracking-[0.1em] shrink-0">
             ATELIER ADMIN
           </h2>

           <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-atelier-muted" />
              <input 
                type="text" 
                placeholder="Rechercher un produit, une commande..." 
                className="w-full bg-[#F2EFED] border-none rounded-sm px-12 py-2.5 text-sm focus:ring-1 focus:ring-atelier-primary/20 outline-none transition-all placeholder:text-[11px] placeholder:uppercase placeholder:tracking-widest"
              />
           </div>

           <div className="flex items-center gap-6 relative">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-atelier-muted hover:text-atelier-primary"
                >
                  <Bell className="h-5 w-5 stroke-[1.5]" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-atelier-primary rounded-full border-2 border-white" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-6 w-80 bg-white border border-atelier-border shadow-2xl rounded-sm py-4 z-50">
                    <div className="px-6 py-2 border-b border-atelier-border mb-2 flex justify-between items-center">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-atelier-text">Notifications</h4>
                       <button onClick={() => setShowNotifications(false)}><X className="h-3 w-3 text-atelier-muted" /></button>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className={`px-6 py-4 hover:bg-atelier-bg transition-colors cursor-pointer ${n.unread ? 'bg-atelier-primary/5' : ''}`}>
                         <div className="flex items-start gap-3">
                           {n.unread && <div className="h-2 w-2 rounded-full bg-atelier-primary mt-1.5 flex-shrink-0" />}
                           <div className={n.unread ? '' : 'ml-5'}>
                             <p className="text-xs font-bold text-atelier-text">{n.title}</p>
                             <p className="text-[9px] text-atelier-muted uppercase mt-1">{n.time}</p>
                           </div>
                         </div>
                      </div>
                    ))}
                    <div className="px-6 pt-4 mt-2 border-t border-atelier-border">
                       <button
                         onClick={() => { setShowNotifications(false); navigate({ to: '/admin/orders' }) }}
                         className="text-[9px] font-bold uppercase tracking-widest text-atelier-primary hover:underline flex items-center gap-1"
                       >
                         Voir toutes les alertes <ArrowRight className="h-3 w-3" />
                       </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="text-atelier-muted hover:text-atelier-primary">
                <HelpCircle className="h-5 w-5 stroke-[1.5]" />
              </button>
              <div className="h-8 w-[1px] bg-atelier-border" />
               <div className="flex items-center gap-3 bg-atelier-bg px-4 py-2 rounded-sm border border-atelier-border">
                  <div className="h-8 w-8 rounded-full bg-atelier-primary flex items-center justify-center text-white text-[10px] font-bold">
                     {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-text leading-tight">{user?.name}</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-atelier-muted leading-tight">Admin Curator</span>
                  </div>
               </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#FAF7F4]">
           {/* Breadcrumbs */}
           <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-atelier-muted mb-8">
             <span>Admin</span>
             <ChevronRight className="h-3 w-3" />
             <span className="text-atelier-text">{location.pathname.split('/').pop() || 'Dashboard'}</span>
           </div>
           
           <Outlet />
        </main>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          onClick={() => setShowModal(false)}
        >
           <div
             className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="p-8 border-b border-atelier-border flex justify-between items-center bg-atelier-bg">
                 <div>
                   <h3 className="font-serif text-3xl font-bold text-atelier-text">
                     {modalView === 'collection' ? 'Nouvelle Collection' : 'Action Dashboard'}
                   </h3>
                   <p className="text-[10px] uppercase tracking-[0.2em] text-atelier-muted mt-1">
                     {modalView === 'collection' ? 'Créer une curation saisonnière' : 'Choisir une action rapide'}
                   </p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                   <X className="h-6 w-6 text-atelier-muted" />
                 </button>
              </div>

              {/* Menu view */}
              {modalView === 'menu' && (
                <div className="p-10 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      {/* New Collection card */}
                      <button
                        onClick={() => setModalView('collection')}
                        className="p-8 border border-atelier-border rounded-sm hover:border-atelier-primary hover:bg-atelier-primary/5 group transition-all text-left space-y-4"
                      >
                         <FolderPlus className="h-8 w-8 text-atelier-muted group-hover:text-atelier-primary transition-colors" />
                         <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-atelier-text">Nouvelle Collection</p>
                            <p className="text-[10px] text-atelier-muted mt-1 uppercase">Créer une curation saisonnière</p>
                         </div>
                         <ArrowRight className="h-4 w-4 text-atelier-muted group-hover:text-atelier-primary transition-colors" />
                      </button>

                      {/* Add Product card */}
                      <button
                        onClick={handleGoToCatalog}
                        className="p-8 border border-atelier-border rounded-sm hover:border-atelier-primary hover:bg-atelier-primary/5 group transition-all text-left space-y-4"
                      >
                         <Package className="h-8 w-8 text-atelier-muted group-hover:text-atelier-primary transition-colors" />
                         <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-atelier-text">Ajouter un Produit</p>
                            <p className="text-[10px] text-atelier-muted mt-1 uppercase">Intégrer une nouvelle référence</p>
                         </div>
                         <ArrowRight className="h-4 w-4 text-atelier-muted group-hover:text-atelier-primary transition-colors" />
                      </button>
                   </div>
                </div>
              )}

              {/* New Collection form view */}
              {modalView === 'collection' && (
                <div className="p-10 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Nom de la Collection</label>
                      <input
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        placeholder="ex: Éclat d'Automne 2025"
                        className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary"
                        autoFocus
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Saison</label>
                      <select
                        value={collectionSeason}
                        onChange={(e) => setCollectionSeason(e.target.value)}
                        className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary"
                      >
                        <option>Printemps 2025</option>
                        <option>Été 2025</option>
                        <option>Automne 2025</option>
                        <option>Hiver 2025</option>
                        <option>Toute l'année</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Description (optionnel)</label>
                      <textarea
                        rows={3}
                        placeholder="Une collection inspirée des rituels de beauté marocains..."
                        className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary resize-none"
                      />
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setModalView('menu')}
                        className="flex-1 py-3 border border-atelier-border rounded-sm text-[10px] font-bold uppercase tracking-widest text-atelier-muted hover:bg-atelier-bg transition-all"
                      >
                        Retour
                      </button>
                      <button
                        onClick={handleSaveCollection}
                        disabled={!collectionName.trim() || collectionSaved}
                        className={`flex-1 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          collectionSaved
                            ? 'bg-green-600 text-white'
                            : 'bg-atelier-primary text-white hover:bg-atelier-primary-hover shadow-lg disabled:opacity-40 disabled:cursor-not-allowed'
                        }`}
                      >
                        {collectionSaved ? <><Check className="h-4 w-4" /> Créée !</> : 'Créer la Collection'}
                      </button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  )
}
