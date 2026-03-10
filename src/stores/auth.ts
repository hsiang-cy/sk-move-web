import { create } from 'zustand'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('api_token'),
  isAuthenticated: !!localStorage.getItem('api_token'),
  setToken(token) {
    localStorage.setItem('api_token', token)
    set({ token, isAuthenticated: true })
  },
  logout() {
    localStorage.removeItem('api_token')
    set({ token: null, isAuthenticated: false })
  },
}))
