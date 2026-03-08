import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { MapPin, KeyRound } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import MapBackground from '@/components/inspira/MapBackground'

export default function LoginView() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)

  const [token, setToken2] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = token.trim()
    if (!trimmed) {
      setError('請輸入 API Token')
      return
    }
    if (!trimmed.startsWith('sk-')) {
      setError('Token 格式不正確（應以 sk- 開頭）')
      return
    }
    setToken(trimmed)
    navigate({ to: '/destinations' })
  }

  return (
    <MapBackground>
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 text-primary-content" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none tracking-tight">skMove</h1>
                <p className="text-xs text-base-content/40 mt-0.5">路線規劃管理系統</p>
              </div>
            </div>

            <h2 className="font-semibold text-base text-base-content/70 mb-4">輸入 API Token</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text">API Token</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => { setToken2(e.target.value); setError(null) }}
                    placeholder="sk-xxxxxxxxxxxxxxxx"
                    className="input input-bordered w-full pl-9"
                    autoComplete="off"
                    required
                  />
                </div>
                <label className="label pb-0">
                  <span className="label-text-alt text-base-content/40">格式：sk-xxxxxxx</span>
                </label>
              </div>

              {error && (
                <div className="alert alert-error py-2.5 text-sm">
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block mt-2">
                進入系統
              </button>
            </form>
          </div>
        </div>
      </div>
    </MapBackground>
  )
}
