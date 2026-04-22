import { BarChart3, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react'

export function AdminAnalytics() {
  const metrics = [
    { label: 'Conversion Rate', value: '4.2%', change: '+0.6%', trend: 'up' },
    { label: 'Avg. Order Value', value: '840 MAD', change: '+12%', trend: 'up' },
    { label: 'Customer Retention', value: '68%', change: '-2%', trend: 'down' },
    { label: 'Net Profit Margin', value: '24.5%', change: '+3%', trend: 'up' },
  ]

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-5xl font-bold text-atelier-text">Brand Analytics</h2>
        <button onClick={() => alert('Sélection de la période : Derniers 7 / 30 / 90 jours — Bientôt disponible.')} className="flex items-center gap-3 bg-white border border-atelier-border px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-atelier-bg transition-all">
          <Calendar className="h-4 w-4" />
          Derniers 30 Jours
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-8 border border-atelier-border rounded-sm shadow-atelier">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-muted">{m.label}</p>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-4xl font-serif font-bold text-atelier-text">{m.value}</p>
              <span className={`flex items-center gap-1 text-[10px] font-bold ${m.trend === 'up' ? 'text-green-600' : 'text-atelier-danger-text'}`}>
                {m.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-atelier-border p-8 rounded-sm shadow-atelier h-[450px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
             <h3 className="font-serif text-2xl font-bold">Performance des Ventes</h3>
             <BarChart3 className="h-5 w-5 text-atelier-muted" />
          </div>
          <div className="flex-1 bg-atelier-bg/50 rounded-sm flex items-center justify-center border border-dashed border-atelier-border">
             <p className="font-serif italic text-atelier-muted">Visualisation Graphique Temporelle</p>
          </div>
        </div>

        <div className="bg-white border border-atelier-border p-8 rounded-sm shadow-atelier h-[450px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
             <h3 className="font-serif text-2xl font-bold">Répartition par Catégorie</h3>
             <PieChart className="h-5 w-5 text-atelier-muted" />
          </div>
          <div className="flex-1 bg-atelier-bg/50 rounded-sm flex items-center justify-center border border-dashed border-atelier-border">
             <p className="font-serif italic text-atelier-muted">Analyse Segmentaire du Catalogue</p>
          </div>
        </div>
      </div>

      <div className="bg-atelier-primary p-12 rounded-sm shadow-2xl text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <TrendingUp className="h-64 w-64" />
         </div>
         <div className="relative z-10">
            <h3 className="font-serif text-3xl font-bold mb-4 italic">Insight de l'IA</h3>
            <p className="max-w-2xl text-lg opacity-90 leading-relaxed font-light">
              D'après vos données de vente actuelles, nous prévoyons une augmentation de <span className="font-bold underline decoration-white/30 underline-offset-8">25% de la demande</span> pour les produits de la catégorie <span className="italic">"Soins Visage"</span> au cours de la fête des mères. Pensez à ajuster vos stocks d'ici 2 semaines.
            </p>
            <button onClick={() => alert('Génération du rapport de prévision IA en cours... Fonctionnalité bientôt disponible.')} className="mt-10 bg-white text-atelier-primary px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-atelier-primary-light transition-colors shadow-xl">
               Générer un Rapport de Prévision
            </button>
         </div>
      </div>
    </div>
  )
}
