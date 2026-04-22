import { BarChart3, TrendingUp, ShoppingBag, Users as UsersIcon } from 'lucide-react'

export function AdminDashboard() {
  const stats = [
    { label: 'Revenue Mensuel', value: '458.200 MAD', change: '+12%', icon: BarChart3 },
    { label: 'Commandes Actives', value: '142', change: '+5%', icon: ShoppingBag },
    { label: 'Nouveaux Clients', value: '1.284', change: '+18%', icon: UsersIcon },
    { label: 'Taux de Conversion Digital', value: '3.4%', change: '+0.8%', icon: TrendingUp },
  ]

  const bestSellers = [
    { name: 'Sérum Rose Botanique', sales: 452, revenue: '203,400 MAD', category: 'Soins Visage', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100' },
    { name: 'Rouge Velvet N°04', sales: 385, revenue: '111,650 MAD', category: 'Maquillage', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=100' },
    { name: 'L\'Eau de Rose 50ml', sales: 298, revenue: '253,300 MAD', category: 'Parfumerie', img: 'https://images.unsplash.com/photo-1559599101-3042d51e852e?auto=format&fit=crop&q=80&w=100' },
    { name: 'Crème Nuit Intense', sales: 214, revenue: '132,680 MAD', category: 'Soins Visage', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=100' },
  ]

  return (
    <div className="space-y-10">
      <h2 className="font-serif text-5xl font-bold text-atelier-text">Vue d'ensemble</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 border border-atelier-border rounded-sm shadow-atelier group transition-all hover:bg-atelier-primary hover:text-white">
            <div className="flex justify-between items-start mb-6">
              <s.icon className="h-6 w-6 text-atelier-primary group-hover:text-white" />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${i === 3 ? 'text-atelier-muted group-hover:text-white/70' : 'text-green-600 group-hover:text-white'}`}>
                {s.change}
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-muted group-hover:text-white/70">{s.label}</p>
            <p className="mt-2 text-3xl font-serif font-bold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-atelier-border p-8 rounded-sm shadow-atelier h-96 flex items-center justify-center">
            <p className="font-serif text-xl italic text-atelier-muted">Graphique de performance (En attente de données réelles)</p>
         </div>
         <div className="bg-atelier-sidebar border border-atelier-border p-8 rounded-sm shadow-atelier">
            <h3 className="font-serif text-xl font-bold mb-6 italic">Objectifs du Mois</h3>
            <div className="space-y-8">
               {[
                 { label: 'Objectif Ventes', progress: 75 },
                 { label: 'Acquisition Clients', progress: 40 },
                 { label: 'Score NPS', progress: 92 },
               ].map((goal, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-atelier-muted">
                      <span>{goal.label}</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white border border-atelier-border rounded-full overflow-hidden">
                       <div className="h-full bg-atelier-primary transition-all duration-1000" style={{ width: `${goal.progress}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-white border border-atelier-border rounded-sm shadow-atelier overflow-hidden">
         <div className="p-8 border-b border-atelier-border bg-[#FAF7F4] flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-atelier-text italic">Meilleures Ventes</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Performance Mensuelle</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="border-b border-atelier-border text-[9px] font-bold uppercase tracking-[0.2em] text-atelier-muted">
                  <tr>
                     <th className="px-8 py-4">Produit</th>
                     <th className="px-8 py-4">Catégorie</th>
                     <th className="px-8 py-4 text-center">Unités Vendues</th>
                     <th className="px-8 py-4 text-right">Revenue Généré</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-atelier-border">
                  {bestSellers.map((product, i) => (
                     <tr key={i} className="hover:bg-atelier-bg/30 transition-colors">
                        <td className="px-8 py-4">
                           <div className="flex items-center gap-4">
                              <img src={product.img} className="h-12 w-12 rounded-sm object-cover border border-atelier-border" />
                              <span className="text-sm font-bold text-atelier-text">{product.name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-4 text-xs text-atelier-muted uppercase tracking-widest">{product.category}</td>
                        <td className="px-8 py-4 text-center font-bold text-atelier-text">{product.sales}</td>
                        <td className="px-8 py-4 text-right font-serif font-bold text-atelier-primary">{product.revenue}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
