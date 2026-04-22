import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await axios.post(`${API_URL}/login`, { email, password }, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })
          const { user, access_token } = response.data
          
          set({ 
            user, 
            token: access_token, 
            isAuthenticated: true 
          })
          
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            message: error.response?.data?.message || 'Erreur lors de la connexion' 
          }
        }
      },

      register: async (data) => {
        try {
          const response = await axios.post(`${API_URL}/register`, data, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })
          const { user, access_token } = response.data
          
          set({ 
            user, 
            token: access_token, 
            isAuthenticated: true 
          })
          
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            message: error.response?.data?.message || 'Erreur lors de l’inscription' 
          }
        }
      },

      logout: async () => {
        const { token } = get()
        if (token) {
          try {
            await axios.post(`${API_URL}/logout`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            })
          } catch (e) {
            console.error('Logout failed on server', e)
          }
        }
        set({ user: null, token: null, isAuthenticated: false })
      },

      fetchUser: async () => {
        const { token } = get()
        if (!token) return
        
        try {
          const response = await axios.get(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          set({ user: response.data, isAuthenticated: true })
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false })
        }
      }
    }),
    {
      name: 'glow-auth-storage',
    }
  )
)
