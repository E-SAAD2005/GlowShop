import { useState, useRef } from 'react'
import { Plus, MoreVertical, Eye, Share2, ArrowRight, X, Check, AlertCircle, Ticket, Calendar, Zap, LayoutGrid } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function AdminPromotions() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Panel States
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelMode, setPanelMode] = useState('add') // 'add', 'edit'
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const initialCoupons = [
    { id: 1, code: 'GLOW20', value: '-20% Panier', type: 'PERCENT', amount: 20, usage: '450 / 1000', expiry: '2024-10-31', status: 'ACTIVE' },
    { id: 2, code: 'BIENVENUE', value: '50 MAD Fixe', type: 'FIXED', amount: 50, usage: 'Illimité', expiry: 'Permanent', status: 'ACTIVE' },
    { id: 3, code: 'SUMMER-GLOW', value: '-15% Été', type: 'PERCENT', amount: 15, usage: '892 / 892', expiry: '2024-08-31', status: 'EXPIRED' },
  ]

  const [couponsList, setCouponsList] = useState(initialCoupons)

  const openAddPanel = () => {
    setPanelMode('add')
    setSelectedCoupon(null)
    setIsPanelOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const form = e.target
      const newCoupon = {
        id: Date.now(),
        code: form.code.value.toUpperCase(),
        value: form.type.value === 'PERCENT' ? `-${form.amount.value}%` : `${form.amount.value} MAD`,
        type: form.type.value,
        amount: form.amount.value,
        usage: '0 / ' + (form.limit.value || '∞'),
        expiry: form.expiry.value || 'Permanent',
        status: 'ACTIVE'
      }

      setCouponsList(prev => [newCoupon, ...prev])
      setIsSubmitting(false)
      setShowSuccess(true)
      
      setTimeout(() => {
        setShowSuccess(false)
        setIsPanelOpen(false)
      }, 1500)
    }, 1000)
  }

  return (
    <div className="pb-10 font-sans relative">
      <div className="flex items-center justify-between mb-2 mt-4 ml-1">
         <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-atelier-primary font-sans">Curator Dashboard</h4>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h2 className="font-serif text-5xl font-bold text-atelier-text italic">Promotions</h2>
        <div className="flex gap-4">
           <button 
            onClick={() => window.open('/', '_blank')}
            className="bg-white border border-atelier-border px-8 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-atelier-bg transition-colors shadow-atelier"
           >
            Preview Store
           </button>
           <button 
            onClick={openAddPanel}
            className="bg-atelier-primary px-8 py-3 rounded-sm flex items-center gap-3 text-white transition-all shadow-lg active:scale-95"
           >
             <Plus className="h-4 w-4" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Nouveau Coupon</span>
           </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         {[
           { label: 'Total Remises', value: '42.800', unit: 'MAD', sub: '↗ +12% ce mois', icon: Ticket },
           { label: 'Taux d’utilisation', value: '64.2', unit: '%', sub: 'Performance Coupons', icon: Zap },
           { label: 'Revenue via Promo', value: '156.400', unit: 'MAD', sub: 'ROI: 3.6x', icon: ArrowRight },
           { label: 'Offres Actives', value: couponsList.filter(c => c.status === 'ACTIVE').length, unit: '', sub: 'Campagnes en cours', icon: LayoutGrid },
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 border border-atelier-border rounded-sm shadow-atelier space-y-3 group hover:border-atelier-primary transition-colors">
              <div className="flex justify-between items-start">
                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-atelier-muted">{s.label}</p>
                 <s.icon className="h-4 w-4 text-atelier-muted opacity-30 group-hover:text-atelier-primary group-hover:opacity-100 transition-all" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-serif font-bold text-atelier-text">{s.value}</p>
                <span className="text-xs font-bold text-atelier-muted uppercase">{s.unit}</span>
              </div>
              <p className="text-[9px] font-bold tracking-widest text-atelier-primary opacity-60 group-hover:opacity-100 transition-opacity uppercase">
                 {s.sub}
              </p>
           </div>
         ))}
      </div>

      {/* Codes Promo Section */}
      <section className="mb-16">
         <div className="flex items-center justify-between mb-8 border-b border-atelier-border pb-4">
            <h3 className="font-serif text-2xl font-bold flex items-center gap-3 text-atelier-text">
              Générateur de Coupons
              <span className="text-xs font-sans font-normal text-atelier-muted tracking-wide italic">Codes personnalisés & Remises fixes.</span>
            </h3>
         </div>

         <div className="bg-white border border-atelier-border rounded-sm shadow-atelier overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#FAF7F4] border-b border-atelier-border uppercase text-[10px] font-bold tracking-[0.2em] text-atelier-muted">
                <tr>
                  <th className="px-8 py-6">Code Coupon</th>
                  <th className="px-8 py-6">Valeur de Remise</th>
                  <th className="px-8 py-6 text-center">Utilisation</th>
                  <th className="px-8 py-6">Expiration</th>
                  <th className="px-8 py-6 text-center">Statut</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-atelier-border">
                {couponsList.map((c) => (
                  <tr key={c.id} className="group hover:bg-atelier-bg/30 transition-all">
                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-atelier-primary tracking-[0.15em]">{c.code}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs font-bold text-atelier-text">{c.value}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-xs text-atelier-muted font-medium">{c.usage}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs text-atelier-muted">{c.expiry}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                         c.status === 'ACTIVE' ? 'bg-atelier-success text-atelier-success-text' : 'bg-gray-100 text-gray-400'
                       }`}>
                         {c.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button onClick={() => setCouponsList(prev => prev.filter(x => x.id !== c.id))} className="p-2 text-atelier-muted hover:text-atelier-danger-text transition-colors" title="Supprimer">
                          <X className="h-4 w-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </section>

      {/* Side Panel (Add Coupon) */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setIsPanelOpen(false)}>
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />
           <div
             className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="p-10 border-b border-atelier-border flex items-center justify-between bg-atelier-bg">
                 <div>
                    <h3 className="font-serif text-3xl font-bold text-atelier-text">Nouveau Coupon</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-atelier-muted mt-2">Création d'offre promotionnelle</p>
                 </div>
                 <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                    <X className="h-6 w-6 text-atelier-muted" />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-6">
                 {/* Code Name */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Code Coupon</label>
                    <div className="relative">
                       <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-atelier-muted" />
                       <input
                         name="code"
                         required
                         placeholder="ex: GLOW10"
                         className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm pl-12 pr-4 py-3 text-sm outline-none focus:border-atelier-primary uppercase font-bold tracking-widest"
                       />
                    </div>
                 </div>

                 {/* Type + Amount */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Type de Remise</label>
                       <select name="type" className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary">
                          <option value="PERCENT">Pourcentage (%)</option>
                          <option value="FIXED">Montant Fixe (MAD)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Valeur</label>
                       <input
                         name="amount"
                         required
                         type="number"
                         placeholder="20"
                         className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary font-bold"
                       />
                    </div>
                 </div>

                 {/* Limit + Expiry */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Limite d'utilisation</label>
                       <input
                         name="limit"
                         type="number"
                         placeholder="∞ (Illimité)"
                         className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Date d'Expiration</label>
                       <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-atelier-muted" />
                          <input
                            name="expiry"
                            type="date"
                            className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm pl-12 pr-4 py-3 text-sm outline-none focus:border-atelier-primary"
                          />
                       </div>
                    </div>
                 </div>

                 {/* Information Box */}
                 <div className="bg-atelier-bg p-6 rounded-sm border border-atelier-border flex gap-4">
                    <Zap className="h-5 w-5 text-atelier-primary shrink-0" />
                    <p className="text-[10px] text-atelier-muted leading-relaxed uppercase tracking-wide">
                       Les coupons sont actifs dès leur enregistrement et peuvent être utilisés par les clients au moment du checkout.
                    </p>
                 </div>

                 {/* Actions Footer */}
                 <div className="pt-6 space-y-3">
                    <button
                       disabled={isSubmitting || showSuccess}
                       type="submit"
                       className={`w-full py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                          showSuccess
                            ? 'bg-green-600 text-white'
                            : 'bg-atelier-primary text-white hover:bg-atelier-primary-hover shadow-xl'
                       }`}
                    >
                       {isSubmitting ? (
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       ) : showSuccess ? (
                          <><Check className="h-4 w-4" /> Coupon Créé !</>
                       ) : (
                          'Enregistrer le Coupon'
                       )}
                    </button>
                    <button
                       type="button"
                       onClick={() => setIsPanelOpen(false)}
                       className="w-full py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] border border-atelier-border text-atelier-muted hover:bg-atelier-bg transition-all"
                    >
                       Annuler
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}
