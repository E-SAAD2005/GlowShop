import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { Link, useNavigate } from '@tanstack/react-router'
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  Loader2,
  ShieldCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = 'http://localhost:8000/api/v1'

const COUNTRIES = [
  { code: 'MA', label: 'Maroc', carrier: 'Aramex' },
  { code: 'FR', label: 'France', carrier: 'DHL Express' },
  { code: 'ES', label: 'Espagne', carrier: 'DHL Express' },
]

async function validateCart(payload) {
  const res = await fetch(`${API_URL}/cart/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Validation error')
  return res.json()
}

async function placeOrder(payload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Order error')
  return res.json()
}

export function Checkout() {
  const [step, setStep] = useState(1) // 1: Info, 2: Shipping, 3: Payment
  const { items, couponCode, setCoupon, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'MA',
    zip: ''
  })

  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderRef, setOrderRef] = useState(null)

  // Validation Mutation
  const validation = useMutation({
    mutationFn: () => validateCart({
      items: items.map(i => ({ variant_id: i.variant_id, quantity: i.quantity })),
      country_code: shippingInfo.country,
      coupon_code: couponCode || undefined,
    }),
  })

  // Order Mutation
  const checkout = useMutation({
    mutationFn: (validatedData) => placeOrder({
      items: items,
      shipping_country: shippingInfo.country,
      total_mad: validatedData.total_mad,
      shipping_cost_mad: validatedData.shipping_cost_mad,
      carrier: validatedData.carrier,
      customer_info: shippingInfo, // Simplified
    }),
    onSuccess: (data) => {
      setOrderRef(data.order_ref)
      clearCart()
      setStep(4) // Success
    }
  })

  useEffect(() => {
    if (items.length > 0) validation.mutate()
  }, [shippingInfo.country, couponCode])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const validated = validation.data

  const handlePayment = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate Stripe Delay
    await new Promise(r => setTimeout(r, 2500))
    checkout.mutate(validated)
    setIsProcessing(false)
  }

  if (items.length === 0 && !orderRef) {
    return (
       <div className="bg-atelier-bg min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
             <ShoppingBag className="h-16 w-16 text-atelier-border mx-auto mb-8" />
             <h1 className="font-serif text-3xl font-bold text-atelier-text">Votre panier est vide</h1>
             <p className="mt-4 text-sm text-atelier-muted">Commencez vos achats pour découvrir notre sélection exclusive.</p>
             <Link to="/boutique" className="mt-10 inline-block w-full bg-atelier-primary text-white py-5 text-[11px] font-bold uppercase tracking-widest shadow-xl hover:bg-atelier-primary-hover">
               Boutique
             </Link>
          </div>
       </div>
    )
  }

  if (step === 4) {
    return (
      <div className="bg-atelier-bg min-h-screen py-24 flex items-center justify-center px-6">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full bg-white border border-atelier-border shadow-atelier p-12 text-center">
            <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-8" />
            <h1 className="font-serif text-4xl font-bold text-atelier-text italic">Merci pour votre confiance.</h1>
            <p className="mt-6 text-sm text-atelier-muted">
              Votre commande <span className="font-bold text-atelier-text">{orderRef}</span> a été confirmée. 
              Un email avec les détails de la livraison vous a été envoyé.
            </p>
            <div className="mt-10 pt-10 border-t border-atelier-border space-y-4">
               <Link to="/boutique" className="block w-full bg-atelier-primary text-white py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-atelier-primary-hover transition-all">
                 Continuer mes achats
               </Link>
               {!isAuthenticated && (
                  <button className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-primary">
                    Créer un compte pour suivre mon colis
                  </button>
               )}
            </div>
         </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-[#FAF7F4] min-h-screen">
      {/* Checkout Navbar */}
      <header className="bg-white border-b border-atelier-border sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
           <Link to="/" className="font-serif text-2xl font-bold text-atelier-text">GlowShop</Link>
           <div className="flex items-center gap-6">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                   <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= s ? 'bg-atelier-primary text-white' : 'bg-atelier-bg text-atelier-muted'}`}>
                     {s}
                   </div>
                   <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:inline ${step >= s ? 'text-atelier-text' : 'text-atelier-muted'}`}>
                     {s === 1 ? 'Information' : s === 2 ? 'Expédition' : 'Paiement'}
                   </span>
                   {s < 3 && <div className="h-[1px] w-8 bg-atelier-border hidden md:block" />}
                </div>
              ))}
           </div>
           <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-atelier-muted">
              <Lock className="h-3 w-3" /> Sécurisé
           </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Main Flow */}
          <div className="lg:col-span-7">
             <AnimatePresence mode="wait">
                {step === 1 && (
                   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="font-serif text-3xl font-bold text-atelier-text mb-8">Informations de contact</h2>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Prénom</label>
                            <input value={shippingInfo.firstName} onChange={e => setShippingInfo({...shippingInfo, firstName: e.target.value})} className="w-full bg-white border border-atelier-border p-4 text-sm" placeholder="Sophia" />
                         </div>
                         <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Nom</label>
                            <input value={shippingInfo.lastName} onChange={e => setShippingInfo({...shippingInfo, lastName: e.target.value})} className="w-full bg-white border border-atelier-border p-4 text-sm" placeholder="Jenkins" />
                         </div>
                         <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Email</label>
                            <input value={shippingInfo.email} onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})} className="w-full bg-white border border-atelier-border p-4 text-sm" placeholder="sophia@example.com" />
                         </div>
                         <div className="col-span-2 mt-8">
                            <h2 className="font-serif text-3xl font-bold text-atelier-text mb-8">Adresse de livraison</h2>
                         </div>
                         <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Adresse</label>
                            <input value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} className="w-full bg-white border border-atelier-border p-4 text-sm" placeholder="N° 45, Rue des Orangers" />
                         </div>
                         <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Ville</label>
                            <input value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} className="w-full bg-white border border-atelier-border p-4 text-sm" placeholder="Casablanca" />
                         </div>
                         <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Pays</label>
                            <select value={shippingInfo.country} onChange={e => setShippingInfo({...shippingInfo, country: e.target.value})} className="w-full bg-white border border-atelier-border p-4 text-sm outline-none">
                               {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                            </select>
                         </div>
                      </div>
                      <button onClick={() => setStep(2)} className="mt-12 w-full bg-atelier-text text-white py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-atelier-primary transition-all flex items-center justify-center gap-3">
                         Continuer vers l'expédition <ArrowRight className="h-4 w-4" />
                      </button>
                   </motion.div>
                )}

                {step === 2 && (
                   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="font-serif text-3xl font-bold text-atelier-text mb-8">Mode d'expédition</h2>
                      <div className="space-y-4">
                         <div className="bg-white border-2 border-atelier-primary p-6 flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-4">
                               <div className="h-5 w-5 rounded-full border-4 border-atelier-primary" />
                               <div>
                                  <p className="text-[11px] font-bold uppercase tracking-widest text-atelier-text">{validated?.carrier || 'Transporteur'}</p>
                                  <p className="text-[10px] text-atelier-muted">Livraison à domicile sous 2-3 jours ouvrables.</p>
                               </div>
                            </div>
                            <span className="text-xs font-bold">{validated?.shipping_cost_mad === 0 ? 'Gratuit' : `${validated?.shipping_cost_mad} MAD`}</span>
                         </div>
                         <div className="p-4 bg-atelier-primary/5 text-[10px] font-bold uppercase tracking-[0.1em] text-atelier-primary italic flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" /> Assurance livraison incluse gratuitement.
                         </div>
                      </div>
                      <div className="mt-12 flex gap-4">
                         <button onClick={() => setStep(1)} className="flex-1 border border-atelier-border py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all">Retour</button>
                         <button onClick={() => setStep(3)} className="flex-[2] bg-atelier-text text-white py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-atelier-primary transition-all">Aller au paiement</button>
                      </div>
                   </motion.div>
                )}

                {step === 3 && (
                   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                      <h2 className="font-serif text-3xl font-bold text-atelier-text mb-8">Paiement Sécurisé</h2>
                      
                      {/* Stripe Simulator UI */}
                      <div className="bg-white border border-atelier-border p-10 shadow-atelier">
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                               <CreditCard className="h-5 w-5 text-atelier-primary" />
                               <span className="text-sm font-bold uppercase tracking-widest">Carte Bancaire</span>
                            </div>
                            <div className="flex gap-2">
                               <div className="h-6 w-10 bg-atelier-bg rounded-sm border border-atelier-border flex items-center justify-center text-[8px] font-bold">VISA</div>
                               <div className="h-6 w-10 bg-atelier-bg rounded-sm border border-atelier-border flex items-center justify-center text-[8px] font-bold">MCard</div>
                            </div>
                         </div>

                         <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Numéro de Carte</label>
                               <input required value={cardInfo.number} onChange={e => setCardInfo({...cardInfo, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()})} maxLength="19" className="w-full bg-atelier-bg border border-atelier-border p-4 text-sm tracking-[0.2em]" placeholder="4242 4242 4242 4242" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Date d'expiration</label>
                                  <input required value={cardInfo.expiry} onChange={e => setCardInfo({...cardInfo, expiry: e.target.value})} className="w-full bg-atelier-bg border border-atelier-border p-4 text-sm" placeholder="MM / YY" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">CVC</label>
                                  <input required value={cardInfo.cvc} onChange={e => setCardInfo({...cardInfo, cvc: e.target.value})} maxLength="3" className="w-full bg-atelier-bg border border-atelier-border p-4 text-sm" placeholder="123" />
                               </div>
                            </div>
                            <button disabled={isProcessing} className="w-full bg-atelier-primary text-white py-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-atelier-primary-hover disabled:opacity-70 transition-all flex items-center justify-center gap-3">
                               {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Traitement sécurisé...</> : `Payer ${validated?.total_mad} MAD`}
                            </button>
                         </form>
                      </div>

                      <div className="flex items-center justify-center gap-4 text-atelier-muted opacity-60">
                         <ShieldCheck className="h-4 w-4" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Vos données sont cryptées par SSL de 256 bits</span>
                      </div>
                      <button onClick={() => setStep(2)} className="w-full text-[10px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-primary">← Retour aux options d'expédition</button>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
             <div className="bg-white border border-atelier-border p-8 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-atelier-text border-b border-atelier-border pb-6">Récapitulatif de commande</h3>
                
                <div className="mt-8 space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {items.map(item => (
                      <div key={item.variant_id} className="flex gap-4">
                         <div className="h-20 w-16 bg-atelier-bg border border-atelier-border flex-shrink-0">
                            <img src={item.image} className="w-full h-full object-contain" />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-xs font-bold text-atelier-text line-clamp-1">{item.name}</h4>
                            <p className="mt-1 text-[10px] text-atelier-muted uppercase tracking-widest">Quantité: {item.quantity}</p>
                            <p className="mt-2 text-xs font-bold">{item.price * item.quantity} MAD</p>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Coupon Input */}
                <div className="mt-10 pt-10 border-t border-atelier-border">
                   <div className="flex gap-2">
                      <input 
                        value={couponCode || ''} 
                        onChange={e => setCoupon(e.target.value.toUpperCase())}
                        className="flex-1 bg-atelier-bg border border-atelier-border px-4 py-3 text-xs outline-none focus:border-atelier-primary" 
                        placeholder="CODE PROMO" 
                      />
                      <button className="bg-atelier-text text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest">OK</button>
                   </div>
                </div>

                {/* Totals */}
                <div className="mt-10 space-y-4 pt-10 border-t border-atelier-border">
                   <div className="flex justify-between text-xs text-atelier-muted">
                      <span>Sous-total</span>
                      <span className="font-bold text-atelier-text">{subtotal} MAD</span>
                   </div>
                   <div className="flex justify-between text-xs text-atelier-muted">
                      <span>Livraison ({validated?.carrier || '-'})</span>
                      <span className="font-bold text-atelier-text">
                        {validated?.shipping_cost_mad === 0 ? 'Gratuit' : validated ? `${validated.shipping_cost_mad} MAD` : 'Calcul...'}
                      </span>
                   </div>
                   {validated?.discount_mad > 0 && (
                      <div className="flex justify-between text-xs text-green-600">
                        <span>Réduction</span>
                        <span className="font-bold">-{validated.discount_mad} MAD</span>
                      </div>
                   )}
                   <div className="flex justify-between text-lg font-serif font-bold text-atelier-text pt-6 border-t border-atelier-border italic">
                      <span>Total à payer</span>
                      <span>{validated?.total_mad || subtotal} MAD</span>
                   </div>
                </div>
             </div>
             
             <div className="mt-10 p-8 border border-atelier-border space-y-4">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-atelier-bg flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-atelier-primary" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest">Besoin d'aide ?</p>
                      <p className="text-[9px] text-atelier-muted">Contactez notre support client de 9h à 18h.</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
