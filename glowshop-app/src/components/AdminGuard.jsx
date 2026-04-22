import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../store/authStore'
import { Loader2 } from 'lucide-react'

export function AdminGuard({ children }) {
  const { user, isAuthenticated, fetchUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    } else if (user && user.role !== 'admin') {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, user, navigate])

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAF7F4]">
        <Loader2 className="h-10 w-10 animate-spin text-atelier-primary" />
      </div>
    )
  }

  return children
}
