import { useCartStore } from '../../store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'

export function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-atelier-border"
          >
            <div className="flex items-center justify-between border-b border-atelier-border px-8 py-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-atelier-text">Mon Panier</h2>
                <p className="text-[9px] uppercase tracking-[0.2em] text-atelier-muted mt-1 font-bold">Votre sélection Atelier</p>
              </div>
              <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform text-atelier-muted">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8">
              {items.length === 0 ? (
                <div className="mt-20 text-center">
                  <p className="text-atelier-muted text-sm italic">Votre panier est vide</p>
                  <button 
                    onClick={onClose} 
                    className="mt-8 text-[10px] font-bold uppercase tracking-widest text-atelier-primary border-b border-atelier-primary pb-1"
                  >
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                <ul className="space-y-10">
                  {items.map(item => {
                    const id = item.variantId || item.variant_id
                    return (
                      <li key={id} className="flex gap-6 group">
                        <div className="h-24 w-20 flex-shrink-0 bg-atelier-bg border border-atelier-border p-2">
                          <img src={item.image} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] font-bold text-atelier-text uppercase tracking-widest truncate">{item.name}</p>
                            {item.shade && <p className="text-[9px] text-atelier-muted uppercase tracking-wider mt-1">{item.shade}</p>}
                            <p className="mt-2 text-sm font-bold text-atelier-primary">{item.price} MAD</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-atelier-border">
                              <button 
                                onClick={() => updateQuantity(id, item.quantity - 1)}
                                className="px-3 py-1 text-xs hover:bg-atelier-bg"
                              >−</button>
                              <span className="w-8 text-center text-[10px] font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(id, item.quantity + 1)}
                                className="px-3 py-1 text-xs hover:bg-atelier-bg"
                              >+</button>
                            </div>
                            <button 
                              onClick={() => removeItem(id)}
                              className="text-[9px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-danger-text transition-colors"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-atelier-border px-8 py-8 bg-[#FAF7F4] space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Sous-total</span>
                  <span className="text-xl font-serif font-bold text-atelier-text">{subtotal} MAD</span>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={onClose}
                  className="block w-full bg-atelier-primary py-5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg hover:bg-atelier-primary-hover transition-all active:scale-[0.98]"
                >
                  Valider la commande
                </Link>
                <p className="text-[9px] text-center text-atelier-muted uppercase tracking-widest">Taxes et frais de port calculés au paiement</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
