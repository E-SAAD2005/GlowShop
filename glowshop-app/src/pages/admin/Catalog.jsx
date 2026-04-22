import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Eye, Edit3, Trash2, Filter, Plus, Search, X, Upload, Check, AlertCircle } from 'lucide-react'
import { createProduct, updateProduct, deleteProduct, fetchProducts } from '../../lib/api'

export function AdminCatalog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Toutes les catégories')
  const [statusFilter, setStatusFilter] = useState('Tous les états')
  
  // Panel States
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelMode, setPanelMode] = useState('add') // 'add', 'view', 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const [productsList, setProductsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const data = await fetchProducts()
      // Map API response to UI format
      const items = (data.data || []).map(p => ({
        id: p.id,
        name: p.name_fr,
        ref: `GLW-${p.id}`,
        category: p.category?.name_fr || 'Sans catégorie',
        price: parseFloat(p.price_mad).toFixed(2),
        stock: p.stock || 0,
        status: (p.stock || 0) > 10 ? 'EN STOCK' : ((p.stock || 0) > 0 ? 'FAIBLE' : 'RUPTURE'),
        expiry: '12/2026', // Placeholder for now
        img: p.main_image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=100'
      }))
      setProductsList(items)
    } catch (err) {
      console.error('Error loading products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.ref.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'Toutes les catégories' || p.category === categoryFilter
    const matchesStatus = statusFilter === 'Tous les états' || p.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const openAddPanel = () => {
    setPanelMode('add')
    setSelectedProduct(null)
    setImagePreview(null)
    setIsPanelOpen(true)
  }

  const openViewPanel = (product) => {
    setPanelMode('view')
    setSelectedProduct(product)
    setImagePreview(product.img)
    setIsPanelOpen(true)
  }

  const openEditPanel = (product) => {
    setPanelMode('edit')
    setSelectedProduct(product)
    setImagePreview(product.img)
    setIsPanelOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const form = e.target
      const fd = new FormData()
      fd.append('name_fr',     form.name.value)
      fd.append('category_name', form.category.value)
      fd.append('price_mad',    form.price.value)
      fd.append('stock',    form.stock.value)
      
      if (fileInputRef.current?.files?.[0]) {
        fd.append('main_image', fileInputRef.current.files[0])
      }

      let result;
      if (panelMode === 'edit') {
        result = await updateProduct(selectedProduct.id, fd)
      } else {
        result = await createProduct(fd)
      }

      // Sync local state
      const updatedProd = {
        id:       result.id,
        name:     result.name_fr,
        ref:      `GLW-${result.id}`,
        category: result.category?.name_fr || form.category.value,
        price:    parseFloat(result.price_mad).toFixed(2),
        stock:    parseInt(form.stock.value),
        status:   parseInt(form.stock.value) > 10 ? 'EN STOCK' : (parseInt(form.stock.value) > 0 ? 'FAIBLE' : 'RUPTURE'),
        expiry:   form.expiry.value || '12/2026',
        img:      result.main_image_url || imagePreview || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=100'
      }

      if (panelMode === 'edit') {
        setProductsList(prev => prev.map(p => p.id === result.id ? updatedProd : p))
      } else {
        setProductsList(prev => [updatedProd, ...prev])
      }

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setIsPanelOpen(false)
      }, 1500)
    } catch (err) {
      setSubmitError(err.message || 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-serif text-5xl font-bold text-atelier-text">Catalogue Produits</h2>
        <button 
          onClick={openAddPanel}
          className="bg-atelier-primary px-8 py-4 rounded-sm flex items-center gap-3 text-white hover:bg-atelier-primary-hover transition-all shadow-lg active:scale-95"
        >
           <Plus className="h-5 w-5" />
           <span className="text-xs font-bold uppercase tracking-widest">Ajouter un Produit</span>
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-atelier-border rounded-sm p-8 shadow-atelier mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-3">
             <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Recherche</label>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-atelier-muted" />
                <input 
                  type="text"
                  placeholder="Nom ou Ref..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm pl-10 pr-4 py-2 text-sm outline-none focus:border-atelier-primary"
                />
             </div>
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Catégorie</label>
             <select 
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
               className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-atelier-primary transition-colors"
             >
               <option>Toutes les catégories</option>
               <option>Soins Visage</option>
               <option>Maquillage</option>
               <option>Parfumerie</option>
             </select>
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">État du stock</label>
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-atelier-primary transition-colors"
             >
               <option>Tous les états</option>
               <option>EN STOCK</option>
               <option>FAIBLE</option>
               <option>RUPTURE</option>
             </select>
          </div>
          <button 
            onClick={() => {
              setSearchTerm('')
              setCategoryFilter('Toutes les catégories')
              setStatusFilter('Tous les états')
            }}
            className="bg-[#EFE3DB] text-atelier-text px-8 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8DDD5] transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-atelier-border rounded-sm shadow-atelier overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#FAF7F4] border-b border-atelier-border uppercase text-[10px] font-bold tracking-[0.2em] text-atelier-muted">
            <tr>
              <th className="px-8 py-6">Produit</th>
              <th className="px-8 py-6">Catégorie</th>
              <th className="px-8 py-6">Prix (MAD)</th>
              <th className="px-8 py-6">Stock</th>
              <th className="px-8 py-6">DLC / Expiration</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-atelier-border">
            {isLoading ? (
               <tr>
                 <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="h-10 w-10 border-4 border-atelier-primary/30 border-t-atelier-primary rounded-full animate-spin" />
                       <p className="font-serif italic text-atelier-muted">Synchronisation avec le catalogue...</p>
                    </div>
                 </td>
               </tr>
            ) : filteredProducts.map((p) => (
              <tr key={p.id} className="group hover:bg-atelier-bg/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-atelier-bg rounded-sm overflow-hidden flex-shrink-0">
                      <img src={p.img} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-serif text-lg font-bold text-atelier-text group-hover:text-atelier-primary transition-colors">{p.name}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-atelier-muted mt-1">Ref: {p.ref}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-[11px] font-medium text-atelier-muted uppercase tracking-widest">{p.category}</p>
                </td>
                <td className="px-8 py-6">
                   <p className="font-bold text-atelier-text">{p.price}</p>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                     p.status === 'EN STOCK' ? 'bg-atelier-success text-atelier-success-text' :
                     p.status === 'FAIBLE' ? 'bg-atelier-warning text-atelier-warning-text' :
                     'bg-atelier-danger text-atelier-danger-text'
                   }`}>
                     {p.status} ({p.stock})
                   </span>
                </td>
                <td className="px-8 py-6">
                   <p className={`text-xs font-medium ${p.status === 'FAIBLE' ? 'text-atelier-danger-text font-bold' : 'text-atelier-muted'}`}>
                     {p.expiry} {p.status === 'FAIBLE' && '⚠️'}
                   </p>
                </td>
                <td className="px-8 py-6 text-right space-x-3">
                   <button 
                     onClick={() => openViewPanel(p)}
                     className="p-2 text-atelier-muted hover:text-atelier-primary transition-colors" 
                     title="Voir les détails"
                   ><Eye className="h-4 w-4" /></button>
                   <button 
                     onClick={() => openEditPanel(p)}
                     className="p-2 text-atelier-muted hover:text-atelier-primary transition-colors"
                     title="Modifier"
                   ><Edit3 className="h-4 w-4" /></button>
                   <button 
                     onClick={async () => {
                       if (window.confirm(`Supprimer "${p.name}" du catalogue ?`)) {
                         try {
                           await deleteProduct(p.id)
                           setProductsList(prev => prev.filter(x => x.id !== p.id))
                         } catch (err) {
                           alert(err.message || 'Erreur lors de la suppression.')
                         }
                       }
                     }}
                     className="p-2 text-atelier-muted hover:text-red-500 transition-colors"
                     title="Supprimer"
                   ><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center font-serif italic text-atelier-muted text-xl">
                  Aucun produit ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side Panel (Add / View / Edit) */}
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
                       {panelMode === 'add' ? 'Nouveau Produit' : 
                        panelMode === 'view' ? 'Détails Produit' : 'Modifier Produit'}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-atelier-muted mt-2">
                       {panelMode === 'view' ? `Ref: ${selectedProduct?.ref}` : 'Intégration au catalogue Curator'}
                    </p>
                 </div>
                 <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                    <X className="h-6 w-6 text-atelier-muted" />
                 </button>
              </div>

              <form 
                key={`${panelMode}-${selectedProduct?.id || 'new'}`}
                onSubmit={handleSubmit} 
                className="flex-1 overflow-y-auto p-10 space-y-6"
              >
                 {/* Nom */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Nom du Produit</label>
                    <input
                      name="name"
                      required
                      readOnly={panelMode === 'view'}
                      defaultValue={selectedProduct?.name}
                      placeholder="ex: Sérum Rose Botanique"
                      className={`w-full border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary ${
                         panelMode === 'view' ? 'bg-transparent border-transparent px-0 font-serif text-xl font-bold' : 'bg-[#FAF7F4]'
                      }`}
                    />
                 </div>

                 {/* Catégorie + Prix */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Catégorie</label>
                       {panelMode === 'view' ? (
                          <p className="text-sm font-medium py-3">{selectedProduct?.category}</p>
                       ) : (
                          <select 
                            name="category" 
                            defaultValue={selectedProduct?.category}
                            className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary"
                          >
                             <option>Soins Visage</option>
                             <option>Maquillage</option>
                             <option>Parfumerie</option>
                             <option>Corps &amp; Bain</option>
                          </select>
                       )}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Prix (MAD)</label>
                       <input
                         name="price"
                         required
                         readOnly={panelMode === 'view'}
                         defaultValue={selectedProduct?.price.replace(',', '.')}
                         type="text"
                         placeholder="450.00"
                         className={`w-full border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary ${
                            panelMode === 'view' ? 'bg-transparent border-transparent px-0 font-bold text-lg text-atelier-primary' : 'bg-[#FAF7F4]'
                         }`}
                       />
                    </div>
                 </div>

                 {/* Stock + Expiration */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Stock Actuel</label>
                       <input
                         name="stock"
                         required
                         readOnly={panelMode === 'view'}
                         defaultValue={selectedProduct?.stock}
                         type="number"
                         placeholder="50"
                         className={`w-full border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary ${
                            panelMode === 'view' ? 'bg-transparent border-transparent px-0 font-bold' : 'bg-[#FAF7F4]'
                         }`}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Date d'Expiration</label>
                       <input
                         name="expiry"
                         type={panelMode === 'view' ? 'text' : 'date'}
                         readOnly={panelMode === 'view'}
                         defaultValue={selectedProduct?.expiry}
                         className={`w-full border border-atelier-border rounded-sm px-4 py-3 text-sm outline-none focus:border-atelier-primary ${
                            panelMode === 'view' ? 'bg-transparent border-transparent px-0' : 'bg-[#FAF7F4]'
                         }`}
                       />
                    </div>
                 </div>

                 {/* Image Upload / Preview */}
                 <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Image du Produit</label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFile(e.target.files?.[0])}
                    />

                    <div
                      onClick={() => panelMode !== 'view' && fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); if(panelMode !== 'view') setIsDragging(true) }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault()
                        setIsDragging(false)
                        if(panelMode !== 'view') handleImageFile(e.dataTransfer.files?.[0])
                      }}
                      className={`h-64 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden relative select-none ${
                        panelMode === 'view' ? 'border-transparent bg-atelier-bg' :
                        isDragging
                          ? 'border-atelier-primary bg-atelier-primary/10 scale-[1.01]'
                          : 'border-atelier-border bg-atelier-bg hover:bg-atelier-primary/5 hover:border-atelier-primary cursor-pointer'
                      }`}
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Aperçu produit"
                            className="absolute inset-0 w-full h-full object-contain p-4"
                          />
                          {panelMode !== 'view' && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Upload className="h-6 w-6 text-white mb-2" />
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white">Changer l'image</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <Upload className={`h-8 w-8 mb-3 transition-colors ${isDragging ? 'text-atelier-primary' : 'text-atelier-muted'}`} />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">
                            {isDragging ? 'Relâchez pour déposer' : 'Cliquez ou glissez une image'}
                          </p>
                        </>
                      )}
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="pt-6 space-y-3">
                    {submitError && (
                      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700 font-medium">{submitError}</p>
                      </div>
                    )}

                    {panelMode !== 'view' ? (
                       <>
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
                                <><Check className="h-4 w-4" /> Enregistré !</>
                             ) : (
                                panelMode === 'add' ? 'Enregistrer le Produit' : 'Mettre à jour le Produit'
                             )}
                          </button>
                          <button
                             type="button"
                             onClick={() => { setIsPanelOpen(false); setSubmitError(null) }}
                             className="w-full py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] border border-atelier-border text-atelier-muted hover:bg-atelier-bg transition-all"
                          >
                             Annuler
                          </button>
                       </>
                    ) : (
                       <button
                          type="button"
                          onClick={() => setPanelMode('edit')}
                          className="w-full bg-atelier-primary text-white py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-atelier-primary-hover shadow-xl transition-all"
                       >
                          Modifier ce Produit
                       </button>
                    )}
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Floating Plus Button */}
      <button
        onClick={openAddPanel}
        className="fixed bottom-10 right-10 h-14 w-14 bg-atelier-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all z-50"
      >
        <Plus className="h-6 w-6 stroke-[3]" />
      </button>
    </div>
  )
}
