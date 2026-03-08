import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

function getToken(): string | null {
  return localStorage.getItem('api_token')
}

export const apiClient = axios.create({ baseURL: BASE })

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('api_token')
      window.location.href = '/login'
    }
    const msg = err.response?.data?.error ?? err.message ?? '請求失敗'
    return Promise.reject(new Error(msg))
  },
)
