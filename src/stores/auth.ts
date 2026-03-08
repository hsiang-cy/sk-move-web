import { create } from 'zustand'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('api_token'),
  get isAuthenticated() {
    return !!get().token
  },
  setToken(token) {
    localStorage.setItem('api_token', token)
    set({ token })
  },
  logout() {
    localStorage.removeItem('api_token')
    set({ token: null })
  },
}))
