import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Star } from 'lucide-react'

export function ReviewsList({ productId }) {
  const queryClient = useQueryClient()
  const [newReview, setNewReview] = useState({ rating: 5, content: '', title: '', skin_type: 'Normale' })
  const [showForm, setShowForm] = useState(false)

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/v1/products/${productId}/reviews`, {
        headers: { 'Accept': 'application/json' }
      })
      return res.json()
    }
  })

  const mutation = useMutation({
    mutationFn: async (reviewData) => {
      const res = await fetch(`http://localhost:8000/api/v1/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(reviewData)
      })
      if (!res.ok) throw new Error('Failed to post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', productId])
      setNewReview({ rating: 5, content: '', title: '', skin_type: 'Normale' })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newReview.content.trim() === '') return
    mutation.mutate(newReview)
  }

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="font-serif text-2xl font-bold text-glow-900">Avis Clients</h2>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {isLoading ? (
            <div>Chargement des avis...</div>
          ) : reviews?.length === 0 ? (
            <p className="text-muted-foreground">Aucun avis pour le moment. Soyez le premier !</p>
          ) : (
            <div className="space-y-6">
              {reviews?.map(review => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex text-glow-500">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    {review.title && <h4 className="font-semibold">{review.title}</h4>}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{review.content}</p>
                  <p className="mt-3 text-xs font-medium text-glow-700">Type de peau: {review.skin_type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {!showForm ? (
            <div className="rounded-xl border border-dashed border-atelier-border p-12 flex flex-col items-center justify-center text-center bg-white/50">
               <h3 className="font-serif text-xl font-bold text-atelier-text">Partagez votre expérience</h3>
               <p className="mt-2 text-sm text-atelier-muted max-w-xs">Votre avis aide la communauté à choisir les meilleurs soins.</p>
               <button 
                onClick={() => setShowForm(true)}
                className="mt-8 bg-atelier-text text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-atelier-primary transition-colors"
               >
                 Laisser un avis
               </button>
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-6 shadow-atelier animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold font-serif">Laisser un avis</h3>
                <button onClick={() => setShowForm(false)} className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-text">Annuler</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Note</label>
                  <div className="mt-2 flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button 
                        key={n}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: n})}
                        className={`p-1 transition-colors ${n <= newReview.rating ? 'text-atelier-primary' : 'text-atelier-border'}`}
                      >
                        <Star className={`h-6 w-6 ${n <= newReview.rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Type de peau</label>
                  <select 
                    className="mt-2 block w-full rounded-sm border-atelier-border bg-white px-3 py-3 text-xs shadow-sm focus:border-atelier-primary outline-none"
                    value={newReview.skin_type}
                    onChange={e => setNewReview({...newReview, skin_type: e.target.value})}
                  >
                    <option>Normale</option>
                    <option>Sèche</option>
                    <option>Grasse</option>
                    <option>Mixte</option>
                    <option>Sensible</option>
                  </select>
                </div>
    
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Commentaire</label>
                  <textarea 
                    className="mt-2 block w-full rounded-sm border-atelier-border bg-white px-3 py-3 text-xs shadow-sm focus:border-atelier-primary outline-none min-h-[120px]"
                    value={newReview.content}
                    onChange={e => setNewReview({...newReview, content: e.target.value})}
                    placeholder="Qu'avez-vous pensé de ce produit ?"
                  ></textarea>
                </div>
    
                <button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="w-full bg-atelier-primary text-white py-4 text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-atelier-primary-hover disabled:opacity-50 transition-all"
                >
                  {mutation.isPending ? 'Envoi en cours...' : 'Publier mon avis'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
