import { useState } from 'react'
import { Eye, Printer, Search, Filter, Download, X, Package, Truck, CheckCircle, Clock, MapPin, User, Mail, Phone, CreditCard } from 'lucide-react'

export function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const initialOrders = [
    { 
      id: 'GLW-1024', 
      date: '14 Oct 2023', 
      customer: 'Layla Benjelloun', 
      email: 'layla@example.com',
      phone: '+212 600 000 000',
      dest: 'Casablanca', 
      address: '24, Boulevard d\'Anfa, Apt 5',
      total: '1,250.00', 
      status: 'DELIVERED', 
      country: '🇲🇦',
      items: [
        { name: 'Sérum Rose Botanique', quantity: 2, price: '450.00' },
        { name: 'Crème Nuit Intense', quantity: 1, price: '350.00' }
      ]
    },
    { 
      id: 'GLW-1023', 
      date: '14 Oct 2023', 
      customer: 'Sophia Jenkins', 
      email: 'sophia@beauty.com',
      phone: '+33 6 12 34 56 78',
      dest: 'Paris', 
      address: '12 Rue de la Paix',
      total: '1,150.00', 
      status: 'SHIPPED', 
      country: '🇫🇷',
      items: [
        { name: 'Rouge Velvet N°04', quantity: 3, price: '290.00' },
        { name: 'L\'Eau de Rose 50ml', quantity: 1, price: '280.00' }
      ]
    },
    { 
      id: 'GLW-1022', 
      date: '13 Oct 2023', 
      customer: 'Karim Alaoui', 
      email: 'karim@atlas.ma',
      phone: '+212 611 223 344',
      dest: 'Marrakech', 
      address: 'Place Jemaa el-Fna',
      total: '840.00', 
      status: 'PROCESSING', 
      country: '🇲🇦',
      items: [
        { name: 'Sérum Rose Botanique', quantity: 1, price: '450.00' },
        { name: 'Huile d\'Argan Pur', quantity: 2, price: '195.00' }
      ]
    },
  ]

  const [ordersList, setOrdersList] = useState(initialOrders)

  const filteredOrders = ordersList.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openOrderPanel = (order) => {
    setSelectedOrder(order)
    setIsPanelOpen(true)
  }

  const updateStatus = (newStatus) => {
    setOrdersList(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
    setSelectedOrder(prev => ({ ...prev, status: newStatus }))
  }

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Order Ref,Date,Customer,Destination,Total,Status\n"
      + filteredOrders.map(o => `${o.id},${o.date},${o.customer},${o.dest},${o.total},${o.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 mt-4 ml-1">
         <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-atelier-primary">Workflow Management</h4>
      </div>
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
           <h2 className="font-serif text-5xl font-bold text-atelier-text">Gestion des Commandes</h2>
           <span className="bg-atelier-primary-light text-atelier-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mt-2">{ordersList.length} total</span>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-[#EFE3DB] px-8 py-3 rounded-sm flex items-center gap-3 text-atelier-text hover:bg-[#E8DDD5] transition-all shadow-sm active:scale-95"
        >
           <Download className="h-4 w-4" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Exporter CSV</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
         {[
           { label: 'Total Orders', value: ordersList.length, sub: '🛒' },
           { label: 'Pending Shipments', value: ordersList.filter(o => o.status === 'PROCESSING').length, sub: '📦', alert: true },
           { label: 'International', value: '15%', sub: '🌍' },
         ].map((s, i) => (
           <div key={i} className="bg-white p-8 border border-atelier-border rounded-sm shadow-atelier relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl -mr-4 -mt-4 group-hover:scale-110 transition-transform">{s.sub}</div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-muted">{s.label}</p>
              <p className="mt-4 text-4xl font-serif font-bold text-atelier-text">{s.value}</p>
           </div>
         ))}
         <div className="bg-atelier-primary p-8 rounded-sm shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-8xl -mr-4 -mt-4">💵</div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Revenue Today</p>
            <p className="mt-4 text-4xl font-serif font-bold italic">12,450 <span className="text-xl">MAD</span></p>
         </div>
      </div>

      {/* Search/Filters */}
      <div className="bg-white border border-atelier-border rounded-sm p-4 shadow-atelier mb-10 flex flex-wrap items-center gap-4">
         <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-atelier-muted" />
            <input 
              type="text" 
              placeholder="Rechercher par ID ou client..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAF7F4] border border-atelier-border rounded-sm px-12 py-3 text-xs outline-none focus:border-atelier-primary" 
            />
         </div>
         
         <div className="flex gap-4">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-atelier-border rounded-sm px-6 py-3 text-[10px] font-bold uppercase tracking-widest outline-none"
            >
              <option value="All">Statut: All</option>
              <option value="DELIVERED">Delivered</option>
              <option value="SHIPPED">Shipped</option>
              <option value="PROCESSING">Processing</option>
            </select>
            <button 
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('All')
              }}
              className="bg-[#EFE3DB] p-3 rounded-sm"
            >
              <Filter className="h-4 w-4" />
            </button>
         </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-atelier-border rounded-sm shadow-atelier overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#FAF7F4] border-b border-atelier-border uppercase text-[10px] font-bold tracking-[0.2em] text-atelier-muted">
            <tr>
              <th className="px-8 py-6">Order Ref</th>
              <th className="px-8 py-6">Date</th>
              <th className="px-8 py-6">Customer Name</th>
              <th className="px-8 py-6 text-center">Destination</th>
              <th className="px-8 py-6">Total</th>
              <th className="px-8 py-6 text-center">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-atelier-border">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="group hover:bg-atelier-bg/30 transition-all">
                <td className="px-8 py-6">
                   <p className="font-bold text-atelier-primary tracking-wider">{o.id}</p>
                </td>
                <td className="px-8 py-6">
                   <p className="text-xs text-atelier-muted">{o.date}</p>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-atelier-primary-light/50 flex items-center justify-center text-[10px] font-bold text-atelier-primary uppercase">
                        {o.customer.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <p className="text-xs font-bold text-atelier-text">{o.customer}</p>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center justify-center gap-2">
                      <span className="text-base">{o.country}</span>
                      <span className="text-xs text-atelier-muted">{o.dest}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-xs font-bold text-atelier-text">{o.total} MAD</p>
                </td>
                <td className="px-8 py-6 text-center">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                     o.status === 'DELIVERED' ? 'bg-atelier-success text-atelier-success-text' :
                     o.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700' :
                     'bg-atelier-warning text-atelier-warning-text'
                   }`}>
                     {o.status}
                   </span>
                </td>
                <td className="px-8 py-6 text-right space-x-3">
                   <button onClick={() => openOrderPanel(o)} className="p-2 text-atelier-muted hover:text-atelier-primary transition-colors"><Eye className="h-4 w-4" /></button>
                   <button onClick={() => window.print()} className="p-2 text-atelier-muted hover:text-atelier-primary transition-colors"><Printer className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Side Panel */}
      {isPanelOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setIsPanelOpen(false)}>
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />
           <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
              
              {/* Panel Header */}
              <div className="p-10 border-b border-atelier-border flex items-center justify-between bg-atelier-bg">
                 <div>
                    <h3 className="font-serif text-3xl font-bold text-atelier-text">Commande {selectedOrder.id}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-atelier-muted mt-2">Détails et Workflow Expédition</p>
                 </div>
                 <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                    <X className="h-6 w-6 text-atelier-muted" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                 
                 {/* Status Flow */}
                 <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-atelier-border -translate-y-1/2" />
                    <div className="relative flex justify-between">
                       {[
                         { id: 'PROCESSING', icon: Clock, label: 'En préparation' },
                         { id: 'SHIPPED', icon: Truck, label: 'Expédié' },
                         { id: 'DELIVERED', icon: CheckCircle, label: 'Livré' }
                       ].map((step, i) => {
                         const isActive = selectedOrder.status === step.id
                         const isPast = (selectedOrder.status === 'SHIPPED' && i === 0) || (selectedOrder.status === 'DELIVERED' && i < 2)
                         return (
                           <button 
                            key={step.id} 
                            onClick={() => updateStatus(step.id)}
                            className="flex flex-col items-center gap-3 relative z-10"
                           >
                              <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${
                                isActive ? 'bg-atelier-primary border-atelier-primary text-white scale-110 shadow-lg' :
                                isPast ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-atelier-border text-atelier-muted'
                              }`}>
                                 <step.icon className="h-5 w-5" />
                              </div>
                              <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-atelier-primary' : 'text-atelier-muted'}`}>
                                {step.label}
                              </span>
                           </button>
                         )
                       })}
                    </div>
                 </div>

                 {/* Customer Info Grid */}
                 <div className="grid grid-cols-2 gap-8 border-t border-atelier-border pt-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-atelier-muted">
                          <User className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Client</span>
                       </div>
                       <p className="font-serif text-xl font-bold text-atelier-text">{selectedOrder.customer}</p>
                       <div className="space-y-1">
                          <p className="flex items-center gap-2 text-xs text-atelier-muted"><Mail className="h-3 w-3" /> {selectedOrder.email}</p>
                          <p className="flex items-center gap-2 text-xs text-atelier-muted"><Phone className="h-3 w-3" /> {selectedOrder.phone}</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-atelier-muted">
                          <MapPin className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Livraison</span>
                       </div>
                       <p className="text-sm font-bold text-atelier-text">{selectedOrder.dest}, {selectedOrder.country}</p>
                       <p className="text-xs text-atelier-muted leading-relaxed">{selectedOrder.address}</p>
                    </div>
                 </div>

                 {/* Order Items List */}
                 <div className="space-y-6 pt-10 border-t border-atelier-border">
                    <div className="flex items-center gap-3 text-atelier-muted mb-4">
                       <Package className="h-4 w-4" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Articles Commandés</span>
                    </div>
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-atelier-bg p-6 rounded-sm border border-atelier-border">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white border border-atelier-border flex items-center justify-center rounded-sm">
                               <Package className="h-6 w-6 text-atelier-muted opacity-30" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-atelier-text">{item.name}</p>
                               <p className="text-[10px] text-atelier-muted uppercase tracking-widest">Quantité: {item.quantity}</p>
                            </div>
                         </div>
                         <p className="text-sm font-bold text-atelier-primary">{item.price} MAD</p>
                      </div>
                    ))}
                 </div>

                 {/* Summary Totals */}
                 <div className="bg-atelier-text text-white p-8 rounded-sm space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                       <span>Paiement</span>
                       <div className="flex items-center gap-2"><CreditCard className="h-3 w-3" /> VISA **** 4242</div>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                       <span className="font-serif text-lg italic">Total de la commande</span>
                       <span className="font-serif text-3xl font-bold">{selectedOrder.total} MAD</span>
                    </div>
                 </div>

              </div>

              {/* Actions Footer */}
              <div className="p-10 border-t border-atelier-border flex gap-4 bg-atelier-bg">
                 <button className="flex-1 bg-white border border-atelier-border py-4 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3">
                    <Printer className="h-4 w-4" /> Imprimer Facture
                 </button>
                 <button 
                   onClick={() => {
                     updateStatus('SHIPPED')
                     setTimeout(() => setIsPanelOpen(false), 500)
                   }}
                   className="flex-1 bg-atelier-primary text-white py-4 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-atelier-primary-hover shadow-lg transition-all"
                 >
                    Expédier la commande
                 </button>
              </div>

           </div>
        </div>
      )}
    </div>
  )
}
