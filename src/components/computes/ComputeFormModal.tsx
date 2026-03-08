import { useState } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { useTriggerCompute } from '@/hooks/useComputes'

interface Props {
  open: boolean
  defaultOrderId: string | undefined
  onClose: () => void
}

export default function ComputeFormModal({ open, defaultOrderId, onClose }: Props) {
  const { data: orders = [] } = useOrders()
  const triggerCompute = useTriggerCompute()

  const [orderId, setOrderId] = useState(defaultOrderId ?? '')
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(30)
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!orderId) { setError('請選擇訂單'); return }
    setError(null)
    try {
      await triggerCompute.mutateAsync({
        orderId,
        body: {
          time_limit_seconds: timeLimitSeconds,
          comment_for_account: comment || undefined,
        },
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '觸發計算失敗')
    }
  }

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-semibold text-lg mb-4">觸發計算</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">訂單</span>
            </label>
            <select className="select select-bordered w-full" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              <option value="">請選擇訂單</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id.slice(0, 8)}...{order.comment_for_account ? ` — ${order.comment_for_account}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">計算時間限制（秒）</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={timeLimitSeconds}
              onChange={(e) => setTimeLimitSeconds(Math.max(1, parseInt(e.target.value) || 30))}
              min="1"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">備註（選填）</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="選填"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-error text-sm py-2"><span>{error}</span></div>}

          <div className="modal-action mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary" disabled={triggerCompute.isPending}>
              {triggerCompute.isPending && <span className="loading loading-spinner loading-xs" />}
              觸發計算
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}><button>關閉</button></form>
    </dialog>
  )
}
