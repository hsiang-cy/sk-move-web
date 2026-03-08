import { ArrowRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { Order } from '@/types'
import { formatTimestamp } from '@/lib/utils'

interface Props {
  open: boolean
  order: Order | null
  onClose: () => void
}

export default function OrderDetailModal({ open, order, onClose }: Props) {
  const navigate = useNavigate()

  if (!open || !order) return null

  function goToComputes() {
    if (!order) return
    onClose()
    navigate({ to: '/computes', search: { orderId: order.id } })
  }

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-semibold text-lg mb-4">訂單詳情</h3>

        <div className="space-y-3 mb-6">
          <div>
            <span className="text-sm text-base-content/50">訂單 ID</span>
            <p className="font-medium font-mono text-sm">{order.id}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-base-content/50">建立時間</span>
              <p className="font-medium text-sm">{formatTimestamp(order.created_at)}</p>
            </div>
            <div>
              <span className="text-sm text-base-content/50">狀態</span>
              <p>
                <span className={`badge badge-sm ${order.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                  {order.status === 'active' ? '有效' : order.status}
                </span>
              </p>
            </div>
          </div>
          {order.comment_for_account && (
            <div>
              <span className="text-sm text-base-content/50">備註</span>
              <p className="font-medium text-sm">{order.comment_for_account}</p>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>關閉</button>
          <button className="btn btn-primary gap-2" onClick={goToComputes}>
            前往計算<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}><button>關閉</button></form>
    </dialog>
  )
}
