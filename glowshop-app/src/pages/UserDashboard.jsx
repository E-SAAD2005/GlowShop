import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'
import { Package, User as UserIcon, Settings, Heart, LogOut, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function UserDashboard() {
  const { user, logout } = useAuthStore()

  const stats = [
    { label: 'Commandes', value: '0', icon: Package },
    { label: 'Favoris', value: '0', icon: Heart },
    { label: 'Points Privilège', value: '150', icon: Heart },
  ]

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-atelier-text">Mon Espace Atelier</h1>
            <p className="text-atelier-muted mt-2">Bienvenue, {user?.name}</p>
          </div>
          <button 
            onClick={() => { if(window.confirm('Déconnexion ?')) logout() }}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-primary transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-atelier-border p-8 rounded-sm shadow-sm"
            >
              <stat.icon className="h-6 w-6 text-atelier-primary mb-4" />
              <p className="text-3xl font-serif font-bold text-atelier-text">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-atelier-text border-b border-atelier-border pb-4 mb-8">Commandes Récentes</h2>
            <div className="bg-[#FAF7F4] border border-atelier-border border-dashed p-12 text-center">
              <Package className="h-8 w-8 text-atelier-border mx-auto mb-4" />
              <p className="text-sm italic text-atelier-muted">Vous n'avez pas encore passé de commande.</p>
              <Link 
                to="/boutique"
                className="mt-6 inline-block text-[10px] font-bold uppercase tracking-widest text-atelier-primary hover:underline"
              >
                Découvrir la boutique
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-atelier-text border-b border-atelier-border pb-4 mb-8">Paramètres du compte</h2>
            <div className="space-y-4">
              {[
                { label: 'Informations personnelles', icon: UserIcon },
                { label: 'Adresses de livraison', icon: Settings },
                { label: 'Moyens de paiement', icon: Settings },
              ].map(item => (
               <button 
                  key={item.label} 
                  onClick={() => alert(`${item.label} sera disponible prochainement.`)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-atelier-border hover:border-atelier-primary transition-all group"
                >
                   <div className="flex items-center gap-4">
                      <item.icon className="h-4 w-4 text-atelier-muted group-hover:text-atelier-primary" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-atelier-text">{item.label}</span>
                   </div>
                   <ArrowRight className="h-3 w-3 text-atelier-border group-hover:text-atelier-primary transition-all group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
