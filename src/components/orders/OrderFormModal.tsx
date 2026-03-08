import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useBentoOrders } from '@/hooks/useBentoOrders'
import { useVehicles } from '@/hooks/useVehicles'
import { useDestinations } from '@/hooks/useDestinations'
import { useCreateOrder } from '@/hooks/useOrders'

interface Props {
  open: boolean
  onClose: () => void
}

export default function OrderFormModal({ open, onClose }: Props) {
  const { data: bentoOrders = [] } = useBentoOrders()
  const { data: vehicles = [] } = useVehicles()
  const { data: destinations = [] } = useDestinations()
  const createOrder = useCreateOrder()

  const [selectedBentoOrderIds, setSelectedBentoOrderIds] = useState<string[]>([])
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const canCreate = bentoOrders.length > 0 && vehicles.length > 0

  if (!open) return null

  function getDestName(id: string) {
    return destinations.find((d) => d.id === id)?.name ?? id.slice(0, 8) + '...'
  }

  function toggleBentoOrder(id: string) {
    setSelectedBentoOrderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleVehicle(id: string) {
    setSelectedVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (selectedBentoOrderIds.length === 0) { setError('請選擇至少一筆便當訂單'); return }
    if (selectedVehicleIds.length === 0) { setError('請選擇至少一輛車輛'); return }
    try {
      await createOrder.mutateAsync({
        bento_order_ids: selectedBentoOrderIds,
        vehicle_ids: selectedVehicleIds,
        comment_for_account: comment || undefined,
      })
      onClose()
      setSelectedBentoOrderIds([])
      setSelectedVehicleIds([])
      setComment('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗，請稍後再試')
    }
  }

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[92dvh] overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4">建立訂單</h3>

        {!canCreate && (
          <div className="alert alert-warning mb-4">
            <AlertCircle className="w-5 h-5" />
            <div className="flex flex-col gap-1">
              {bentoOrders.length === 0 && <span>請先建立至少一筆便當訂單</span>}
              {vehicles.length === 0 && <span>請先建立至少一輛車輛</span>}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bento Orders */}
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">選擇便當訂單 <span className="text-error">*</span></span>
              <span className="label-text-alt text-base-content/40">已選 {selectedBentoOrderIds.length} 筆</span>
            </label>
            <div className="max-h-48 overflow-y-auto border border-base-200 rounded-lg divide-y divide-base-100">
              {bentoOrders.length === 0 ? (
                <div className="text-sm text-base-content/50 py-4 text-center">尚無便當訂單</div>
              ) : bentoOrders.map((order) => (
                <label key={order.id} className="flex items-center gap-3 px-3 py-2 hover:bg-base-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedBentoOrderIds.includes(order.id)}
                    onChange={() => toggleBentoOrder(order.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {getDestName(order.pickup_location_id)} → {getDestName(order.delivery_location_id)}
                    </div>
                    <div className="text-xs text-base-content/40">
                      {order.items.length} 品項
                      {order.unserved_penalty === null ? '・必送' : `・可略過（懲罰 ${order.unserved_penalty}）`}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Vehicles */}
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">選擇車輛 <span className="text-error">*</span></span>
              <span className="label-text-alt text-base-content/40">已選 {selectedVehicleIds.length} 輛</span>
            </label>
            <div className="max-h-40 overflow-y-auto border border-base-200 rounded-lg divide-y divide-base-100">
              {vehicles.length === 0 ? (
                <div className="text-sm text-base-content/50 py-4 text-center">尚無車輛</div>
              ) : vehicles.map((v) => (
                <label key={v.id} className="flex items-center gap-3 px-3 py-2 hover:bg-base-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedVehicleIds.includes(v.id)}
                    onChange={() => toggleVehicle(v.id)}
                  />
                  <span className="text-sm font-mono">{v.vehicle_number}</span>
                  {v.comment_for_account && (
                    <span className="text-xs text-base-content/40">— {v.comment_for_account}</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">備註（選填）</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="選填"
            />
          </div>

          {error && (
            <div className="alert alert-error text-sm py-2"><span>{error}</span></div>
          )}

          <div className="modal-action mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary" disabled={!canCreate || createOrder.isPending}>
              {createOrder.isPending && <span className="loading loading-spinner loading-xs" />}
              建立訂單
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}><button>關閉</button></form>
    </dialog>
  )
}
