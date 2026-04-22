import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../store/authStore'
import { ArrowRight } from 'lucide-react'

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const register = useAuthStore(s => s.register)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = await register(formData)
    if (result.success) {
      navigate({ to: '/' })
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-atelier-bg px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-atelier-text">Rejoindre l'Atelier</h1>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-atelier-muted">
            Créez votre profil beauté personnalisé
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          {error && (
            <div className="bg-atelier-danger border border-atelier-danger-text/20 p-4 text-[11px] font-bold uppercase tracking-widest text-atelier-danger-text">
               {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Nom complet</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white border border-atelier-border px-4 py-4 text-sm outline-none focus:border-atelier-primary transition-colors"
              placeholder="Ex: Sophia Jenkins"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white border border-atelier-border px-4 py-4 text-sm outline-none focus:border-atelier-primary transition-colors"
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border border-atelier-border px-4 py-4 text-sm outline-none focus:border-atelier-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Confirmer le mot de passe</label>
            <input
              name="password_confirmation"
              type="password"
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full bg-white border border-atelier-border px-4 py-4 text-sm outline-none focus:border-atelier-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 bg-atelier-primary py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-atelier-primary-hover disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : 'Créer mon compte'}
            {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="mt-10 text-center">
           <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-primary transition-colors italic">
             Déjà un compte ? Se connecter
           </Link>
        </div>
      </div>
    </div>
  )
}
