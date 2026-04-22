import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const login = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = await login(email, password)
    if (result.success) {
      navigate({ to: '/' })
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-atelier-bg px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-atelier-text">Bon retour</h1>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-atelier-muted">
            Connectez-vous à votre espace personnel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          {error && (
            <div className="bg-atelier-danger border border-atelier-danger-text/20 p-4 text-[11px] font-bold uppercase tracking-widest text-atelier-danger-text">
               {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-atelier-border px-4 py-4 text-sm outline-none focus:border-atelier-primary transition-colors"
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted">Mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-atelier-border px-4 py-4 text-sm outline-none focus:border-atelier-primary transition-colors"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[3.2rem] text-atelier-muted hover:text-atelier-primary"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 bg-atelier-primary py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-atelier-primary-hover disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
            {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="mt-10 text-center space-y-4">
           <Link to="/register" className="block text-[10px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-primary transition-colors italic">
             Pas encore de compte ? Créer un compte
           </Link>
           <button className="text-[10px] font-bold uppercase tracking-widest text-atelier-muted hover:text-atelier-primary transition-colors opacity-60">
             Mot de passe oublié ?
           </button>
        </div>
      </div>
    </div>
  )
}
