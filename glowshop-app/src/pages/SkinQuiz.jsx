import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, ArrowRight, ArrowLeft, Loader2, Sparkles, ShoppingBag } from 'lucide-react'

const API_URL = 'http://localhost:8000/api/v1'

async function submitQuiz(data) {
  const res = await fetch(`${API_URL}/skin-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Network error')
  const json = await res.json()
  if (json.session_token) {
    localStorage.setItem('glow_session_token', json.session_token)
  }
  return json
}

async function fetchRecommendations() {
  const token = localStorage.getItem('glow_session_token')
  const res = await fetch(`${API_URL}/skin-quiz/recommendations`, {
    headers: { 'X-Session-Token': token, 'Accept': 'application/json' }
  })
  if (!res.ok) throw new Error('Recommendations error')
  return res.json()
}

const steps = [
  {
    id: 'skin_type',
    question: "Comment décririez-vous votre peau ?",
    description: "La base de votre routine commence par identifier votre nature de peau.",
    options: [
      { label: 'Sèche', desc: 'Sensation de tiraillement, parfois des desquamations.' },
      { label: 'Grasse', desc: 'Brillance visible, pores dilatés sur l\'ensemble du visage.' },
      { label: 'Mixte', desc: 'Brillance sur la zone T, joues normales ou sèches.' },
      { label: 'Normale', desc: 'Équilibre parfait, ni trop grasse ni trop sèche.' },
      { label: 'Sensible', desc: 'Réactions fréquentes aux produits ou à l\'environnement.' }
    ]
  },
  {
    id: 'concerns',
    question: "Quels sont vos objectifs principaux ?",
    description: "Sélectionnez les préoccupations que vous souhaitez traiter en priorité.",
    multiple: true,
    options: [
      { label: 'Anti-âge', desc: 'Ridules, perte de fermeté et élasticité.' },
      { label: 'Éclat', desc: 'Teint terne, manque de luminosité.' },
      { label: 'Imperfections', desc: 'Acné, points noirs, excès de sébum.' },
      { label: 'Hydratation', desc: 'Manque d’eau, ridules de déshydratation.' },
      { label: 'Taches', desc: 'Hyperpigmentation, cicatrices d\'acné.' },
      { label: 'Apaisement', desc: 'Rougeurs, irritations, inconfort.' }
    ]
  },
  {
    id: 'age_range',
    question: "Savoir vous situer pour mieux vous conseiller.",
    description: "Les besoins de la peau évoluent avec le temps.",
    options: [
       { label: '18 - 25 ans' },
       { label: '26 - 35 ans' },
       { label: '36 - 50 ans' },
       { label: '50 ans +' }
    ]
  }
]

export function SkinQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ skin_type: '', concerns: [], age_range: '' })
  
  const mutation = useMutation({
    mutationFn: submitQuiz,
  })

  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
    enabled: mutation.isSuccess
  })

  const handleSelect = (option, multiple) => {
    const currentId = steps[step].id
    if (multiple) {
      setAnswers(prev => {
        const currentArr = prev[currentId]
        if (currentArr.includes(option)) return { ...prev, [currentId]: currentArr.filter(i => i !== option) }
        return { ...prev, [currentId]: [...currentArr, option] }
      })
    } else {
      setAnswers(prev => ({ ...prev, [currentId]: option }))
      setTimeout(() => handleNext(), 300)
    }
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      mutation.mutate(answers)
    }
  }

  // --- RESULT VIEW ---
  if (mutation.isSuccess) {
    return (
      <div className="bg-atelier-bg min-h-screen">
        <section className="container mx-auto px-6 py-20 text-center">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Sparkles className="h-12 w-12 text-atelier-primary mx-auto mb-6" />
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-atelier-text">Votre Diagnostic <br /> <span className="italic font-normal">est prêt</span></h1>
              <p className="mt-8 text-sm text-atelier-muted max-w-lg mx-auto leading-relaxed">
                Basé sur votre profil ({answers.skin_type}), voici la routine idéale sélectionnée par nos experts.
              </p>
           </motion.div>
        </section>

        <section className="container mx-auto px-6 pb-24">
           {loadingRecs ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="h-8 w-8 text-atelier-primary animate-spin" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Analyse en cours...</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {recommendations?.recommendations?.map((product, i) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white border border-atelier-border p-8 group relative"
                    >
                       <div className="aspect-[3/4] mb-8 overflow-hidden">
                          <img src={product.main_image_url} className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-1000" />
                       </div>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-atelier-primary">{product.brand?.name}</p>
                       <h3 className="mt-2 font-serif text-xl font-bold text-atelier-text line-clamp-1">{product.name_fr}</h3>
                       <p className="mt-4 text-[11px] text-atelier-muted leading-relaxed line-clamp-2">{product.description_fr}</p>
                       <div className="mt-6 flex items-center justify-between border-t border-atelier-border pt-6">
                           <span className="font-bold text-atelier-text">{product.price_mad} MAD</span>
                           <Link to={`/produit/${product.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-atelier-primary flex items-center gap-2">
                             Voir l'article <ArrowRight className="h-3 w-3" />
                           </Link>
                       </div>
                    </motion.div>
                 ))}
                 
                 {/* Empty state if no recs */}
                 {recommendations?.recommendations?.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-atelier-border">
                       <p className="text-sm italic text-atelier-muted">Aucune recommandation trouvée pour ce profil précis. <br /> Parcourez notre catalogue général.</p>
                       <Link to="/boutique" className="mt-6 inline-block btn-primary">Boutique</Link>
                    </div>
                 )}
              </div>
           )}
           
           <div className="mt-20 flex justify-center gap-6">
              <button 
                onClick={() => window.location.reload()} 
                className="text-[10px] font-bold uppercase tracking-widest border-b border-atelier-muted pb-1 text-atelier-muted hover:text-atelier-primary transition-colors"
              >
                Refaire le quiz
              </button>
              <Link to="/checkout" className="bg-atelier-primary text-white px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-atelier-primary-hover active:scale-95 transition-all flex items-center gap-3">
                 <ShoppingBag className="h-4 w-4" /> Passer à la caisse
              </Link>
           </div>
        </section>
      </div>
    )
  }

  // --- QUESTIONS VIEW ---
  const currentStep = steps[step]

  return (
    <div className="bg-atelier-bg min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl bg-white border border-atelier-border shadow-atelier overflow-hidden relative">
        <div className="h-1 bg-atelier-primary-light w-full">
           <motion.div 
            className="h-full bg-atelier-primary" 
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
           />
        </div>

        <div className="p-8 md:p-16">
          <header className="mb-12 flex justify-between items-center">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-atelier-primary">Question {step + 1} / {steps.length}</span>
             <button 
                onClick={() => setStep(Math.max(0, step - 1))} 
                className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-primary transition-colors ${step === 0 ? 'opacity-0' : 'opacity-100'}`}
             >
                <ArrowLeft className="h-4 w-4" /> Retour
             </button>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-atelier-text leading-tight">{currentStep.question}</h2>
              <p className="mt-4 text-sm text-atelier-muted font-medium italic">{currentStep.description}</p>
              
              <div className="mt-12 space-y-4">
                {currentStep.options.map(option => {
                  const multiple = currentStep.multiple
                  const isSelected = multiple ? answers[currentStep.id].includes(option.label) : answers[currentStep.id] === option.label
                  return (
                    <button
                      key={option.label}
                      onClick={() => handleSelect(option.label, multiple)}
                      className={`w-full text-left p-6 border transition-all duration-300 group ${
                        isSelected 
                          ? 'border-atelier-primary bg-atelier-primary/5 shadow-md flex items-center justify-between' 
                          : 'border-atelier-border hover:border-atelier-primary hover:bg-atelier-bg'
                      }`}
                    >
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-atelier-primary' : 'text-atelier-text'}`}>{option.label}</p>
                        {option.desc && <p className="mt-1 text-[10px] text-atelier-muted font-medium">{option.desc}</p>}
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-atelier-primary" />}
                    </button>
                  )
                })}
              </div>

              {(currentStep.multiple || (mutation.isIdle && step === steps.length - 1)) && (
                <button 
                  onClick={handleNext}
                  className="mt-10 group w-full bg-atelier-primary py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl hover:bg-atelier-primary-hover active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {mutation.isPending ? 'Analyse...' : step === steps.length - 1 ? 'Terminer mon diagnostic' : 'Étape suivante'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
