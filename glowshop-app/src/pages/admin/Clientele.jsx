import { useState, useRef } from 'react'
import { Eye, Search, Filter, Plus, Star, Users, X, Download, FileText, Upload, Check, AlertCircle, Mail, User, ShieldCheck } from 'lucide-react'

export function AdminClientele() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('Tous les Tiers')
  
  // Panel States
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelMode, setPanelMode] = useState('view') // 'view', 'add'
  const [selectedClient, setSelectedClient] = useState(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const initialClients = [
    { id: 1, name: 'Camille Laurent', email: 'camille.l@example.com', skin: 'MIXTE', tier: 'PLATINUM', points: '1,240 pts', lastOrder: '12 Oct 2023', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { id: 2, name: 'Julien Mercier', email: 'j.mercier@test.com', skin: 'SÈCHE', tier: 'SILVER', points: '450 pts', lastOrder: 'Hier', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150' },
    { id: 3, name: 'Sofia Rossi', email: 'sofia.rossi@luxe.it', skin: 'GRASSE', tier: 'GOLD', points: '890 pts', lastOrder: '05 Oct 2023', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
    { id: 4, name: 'Marc Dupont', email: 'm.dupont@web.fr', skin: 'MIXTE', tier: 'BRONZE', points: '120 pts', lastOrder: 'Il y a 3h', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  ]

  const [clientsList, setClientsList] = useState(initialClients)

  const filteredClients = clientsList.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = tierFilter === 'Tous les Tiers' || c.tier === tierFilter
    return matchesSearch && matchesTier
  })

  const openAddPanel = () => {
    setPanelMode('add')
    setSelectedClient(null)
    setImagePreview(null)
    setIsPanelOpen(true)
  }

  const openViewPanel = (client) => {
    setPanelMode('view')
    setSelectedClient(client)
    setImagePreview(client.img)
    setIsPanelOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const form = e.target
      const newClient = {
        id: Date.now(),
        name: form.name.value,
        email: form.email.value,
        skin: form.skin.value,
        tier: form.tier.value,
        points: '0 pts',
        lastOrder: 'Jamais',
        img: imagePreview || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
      }

      setClientsList(prev => [newClient, ...prev])
      setIsSubmitting(false)
      setShowSuccess(true)
      
      setTimeout(() => {
        setShowSuccess(false)
        setIsPanelOpen(false)
      }, 1500)
    }, 1000)
  }

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2 mt-4 ml-1">
         <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-atelier-primary font-sans">CRM Dashboard</h4>
      </div>
      
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-serif text-5xl font-bold text-atelier-text">Gestion de la Clientèle</h2>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-atelier-muted" />
              <input 
                type="text" 
                placeholder="Rechercher un client..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-atelier-border rounded-sm px-12 py-3 text-xs outline-none focus:border-atelier-primary w-64 shadow-atelier"
              />
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
         {[
           { label: 'Total Customers', value: clientsList.length, sub: '+12% ce mois', icon: Users },
           { label: 'GlowPoints Members', value: clientsList.filter(c => c.tier !== 'BRONZE').length, sub: 'High Engagement', icon: Star },
           { label: 'Skin Quiz Score', value: '74.2%', sub: 'Optimal Data', icon: ShieldCheck },
         ].map((s, i) => (
           <div key={i} className="bg-white p-8 border border-atelier-border rounded-sm shadow-atelier flex items-center justify-between group">
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-muted">{s.label}</p>
                <p className="text-4xl font-serif font-bold text-atelier-text">{s.value}</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block ${i === 0 ? 'bg-green-50 text-green-600' : 'bg-atelier-bg text-atelier-primary'}`}>{s.sub}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-atelier-sidebar flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform">
                 <s.icon className="h-6 w-6" />
              </div>
           </div>
         ))}
      </div>

      {/* List Header & Filters */}
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-8">
            <h3 className="font-serif text-2xl font-bold">Répertoire Clients</h3>
            <select 
             value={tierFilter}
             onChange={(e) => setTierFilter(e.target.value)}
             className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-atelier-muted outline-none cursor-pointer hover:text-atelier-primary"
            >
              <option>Tous les Tiers</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
              <option value="BRONZE">Bronze</option>
            </select>
         </div>
         <button 
          onClick={openAddPanel}
          className="bg-atelier-primary px-8 py-3 rounded-sm flex items-center gap-3 text-white hover:bg-atelier-primary-hover transition-all shadow-lg active:scale-95"
         >
           <Plus className="h-4 w-4" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Ajouter un Client</span>
         </button>
      </div>

      {/* Client Table */}
      <div className="bg-white border border-atelier-border rounded-sm shadow-atelier overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#FAF7F4] border-b border-atelier-border uppercase text-[10px] font-bold tracking-[0.2em] text-atelier-muted">
            <tr>
              <th className="px-8 py-6">Client</th>
              <th className="px-8 py-6">Skin Type</th>
              <th className="px-8 py-6">Loyalty Tier</th>
              <th className="px-8 py-6">GlowPoints</th>
              <th className="px-8 py-6">Last Order</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-atelier-border">
            {filteredClients.map((c) => (
              <tr key={c.id} className="group hover:bg-atelier-bg/30 transition-all">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <img src={c.img} className="h-12 w-12 rounded-full object-cover border-2 border-atelier-border shadow-sm" />
                      <div>
                         <p className="text-sm font-bold text-atelier-text">{c.name}</p>
                         <p className="text-[10px] font-medium text-atelier-muted lowercase tracking-tighter">{c.email}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 bg-atelier-sidebar border border-atelier-border text-[9px] font-bold tracking-widest text-atelier-muted rounded-full">
                     {c.skin}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                     c.tier === 'PLATINUM' ? 'bg-atelier-primary text-white shadow-md' :
                     c.tier === 'GOLD' ? 'bg-yellow-100 text-yellow-700' :
                     c.tier === 'SILVER' ? 'bg-slate-100 text-slate-600' :
                     'bg-orange-100 text-orange-700'
                   }`}>
                     ★ {c.tier}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <p className="text-xs font-bold text-atelier-text">{c.points}</p>
                </td>
                <td className="px-8 py-6 italic text-atelier-muted text-xs">
                   {c.lastOrder}
                </td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => openViewPanel(c)} className="p-2 text-atelier-muted hover:text-atelier-primary transition-colors"><Eye className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Panel (Add / View) */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setIsPanelOpen(false)}>
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />
           <div
             className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="p-10 border-b border-atelier-border flex items-center justify-between bg-atelier-bg">
                 <div>
                    <h3 className="font-serif text-3xl font-bold text-atelier-text">
                       {panelMode === 'add' ? 'Nouveau Client' : 'Profil Client'}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-atelier-muted mt-2">
                       {panelMode === 'add' ? 'Enregistrement CRM' : `ID: #CL-${selectedClient?.id}`}
                    </p>
                 </div>
                 <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                    <X className="h-6 w-6 text-atelier-muted" />
                 </button>
              </div>

              <form 
                key={selectedClient?.id || 'new'}
                onSubmit={handleSubmit} 
                className="flex-1 overflow-y-auto p-10 space-y-8"
              >
                 {/* Header Info */}
                 <div className="flex items-center gap-6 pb-8 border-b border-atelier-border">
                    <div 
                      onClick={() => panelMode === 'add' && fileInputRef.current?.click()}
                      className={`h-24 w-24 rounded-full border-4 border-[#FAF7F4] shadow-md flex items-center justify-center overflow-hidden relative group ${panelMode === 'add' ? 'cursor-pointer' : ''}`}
                    >
                       {imagePreview || selectedClient?.img ? (
                          <img src={imagePreview || selectedClient?.img} className="h-full w-full object-cover" />
                       ) : (
                          <User className="h-10 w-10 text-atelier-muted opacity-30" />
                       )}
                       {panelMode === 'add' && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <Upload className="h-6 w-6 text-white" />
                          </div>
                       )}
                    </div>
                    <div className="flex-1 space-y-2">
                       {panelMode === 'add' ? (
                          <>
                             <input name="name" required placeholder="Nom Complet" className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-2 text-sm outline-none focus:border-atelier-primary" />
                             <input name="email" required type="email" placeholder="Email" className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-2 text-sm outline-none focus:border-atelier-primary" />
                          </>
                       ) : (
                          <>
                             <h4 className="font-serif text-3xl font-bold text-atelier-text">{selectedClient?.name}</h4>
                             <p className="text-sm text-atelier-muted">{selectedClient?.email}</p>
                          </>
                       )}
                    </div>
                 </div>

                 {/* Segmentation Grid */}
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Skin Type</label>
                       {panelMode === 'add' ? (
                          <select name="skin" className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary">
                             <option>MIXTE</option>
                             <option>SÈCHE</option>
                             <option>GRASSE</option>
                             <option>SENSIBLE</option>
                          </select>
                       ) : (
                          <p className="text-sm font-bold uppercase tracking-widest">{selectedClient?.skin}</p>
                       )}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Loyalty Tier</label>
                       {panelMode === 'add' ? (
                          <select name="tier" className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary">
                             <option>BRONZE</option>
                             <option>SILVER</option>
                             <option>GOLD</option>
                             <option>PLATINUM</option>
                          </select>
                       ) : (
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest inline-block ${
                             selectedClient?.tier === 'PLATINUM' ? 'bg-atelier-primary text-white shadow-md' :
                             'bg-atelier-bg text-atelier-primary'
                          }`}>
                             ★ {selectedClient?.tier}
                          </span>
                       )}
                    </div>
                 </div>

                 {/* CRM Stats (View Only) */}
                 {panelMode === 'view' && (
                    <div className="space-y-6 pt-8 border-t border-atelier-border">
                       <div className="flex items-center gap-3 text-atelier-muted mb-4">
                          <Star className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Activité Fidélité</span>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-atelier-bg p-6 rounded-sm border border-atelier-border">
                             <p className="text-[9px] font-bold uppercase tracking-widest text-atelier-muted mb-2">Points Disponibles</p>
                             <p className="text-2xl font-serif font-bold text-atelier-primary">{selectedClient?.points}</p>
                          </div>
                          <div className="bg-atelier-bg p-6 rounded-sm border border-atelier-border">
                             <p className="text-[9px] font-bold uppercase tracking-widest text-atelier-muted mb-2">Dernière Commande</p>
                             <p className="text-lg font-bold text-atelier-text">{selectedClient?.lastOrder}</p>
                          </div>
                       </div>
                       
                       <button className="w-full flex items-center justify-center gap-2 bg-white border border-atelier-border py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-text hover:bg-atelier-primary hover:text-white hover:border-atelier-primary transition-all rounded-sm shadow-sm">
                          <FileText className="h-4 w-4" /> Voir Historique Complet
                       </button>
                    </div>
                 )}

                 {/* Hidden input for image */}
                 <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageFile(e.target.files?.[0])} />

                 {/* Actions Footer */}
                 <div className="pt-10">
                    {panelMode === 'add' ? (
                       <div className="space-y-3">
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
                                <><Check className="h-4 w-4" /> Client Ajouté !</>
                             ) : (
                                'Enregistrer le Client'
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
                    ) : (
                       <button
                          type="button"
                          onClick={() => setIsPanelOpen(false)}
                          className="w-full bg-atelier-text text-white py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black shadow-lg transition-all"
                       >
                          Fermer le Profil
                       </button>
                    )}
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}
