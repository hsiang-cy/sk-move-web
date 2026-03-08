import { useState } from 'react'
import { Plus, X, AlertCircle } from 'lucide-react'
import { useDestinations } from '@/hooks/useDestinations'
import { useCreateBentoOrder } from '@/hooks/useBentoOrders'

interface Props {
  open: boolean
  onClose: () => void
}

interface Item { sku: string; quantity: number }

export default function BentoOrderFormModal({ open, onClose }: Props) {
  const { data: destinations = [] } = useDestinations()
  const createBentoOrder = useCreateBentoOrder()

  const [pickupId, setPickupId] = useState('')
  const [deliveryId, setDeliveryId] = useState('')
  const [items, setItems] = useState<Item[]>([{ sku: '', quantity: 1 }])
  const [unservedPenalty, setUnservedPenalty] = useState<'required' | 'optional'>('required')
  const [penaltyValue, setPenaltyValue] = useState(1000)
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  function addItem() {
    setItems((prev) => [...prev, { sku: '', quantity: 1 }])
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateItem(idx: number, field: keyof Item, value: string | number) {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!pickupId) { setError('請選擇取餐地點'); return }
    if (!deliveryId) { setError('請選擇送餐地點'); return }
    if (items.some(item => !item.sku.trim())) { setError('請填寫所有品項名稱'); return }

    try {
      await createBentoOrder.mutateAsync({
        pickup_location_id: pickupId,
        delivery_location_id: deliveryId,
        items: items.map(item => ({ sku: item.sku.trim(), quantity: item.quantity })),
        unserved_penalty: unservedPenalty === 'required' ? null : penaltyValue,
        comment_for_account: comment || undefined,
      })
      onClose()
      setPickupId(''); setDeliveryId('')
      setItems([{ sku: '', quantity: 1 }])
      setComment('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗，請稍後再試')
    }
  }

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-lg max-h-[92dvh] overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4">新增便當訂單</h3>

        {destinations.length === 0 && (
          <div className="alert alert-warning mb-4">
            <AlertCircle className="w-5 h-5" />
            <span>請先建立至少兩個地點（取餐地點和送餐地點）</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">取餐地點（餐廳）<span className="text-error">*</span></span>
            </label>
            <select className="select select-bordered w-full" value={pickupId} onChange={(e) => setPickupId(e.target.value)} required>
              <option value="">請選擇取餐地點</option>
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">送餐地點（目的地）<span className="text-error">*</span></span>
            </label>
            <select className="select select-bordered w-full" value={deliveryId} onChange={(e) => setDeliveryId(e.target.value)} required>
              <option value="">請選擇送餐地點</option>
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="form-control">
            <div className="flex items-center justify-between mb-1.5">
              <span className="label-text font-medium">訂單品項 <span className="text-error">*</span></span>
              <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={addItem}>
                <Plus className="w-3 h-3" />新增品項
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.sku}
                    onChange={(e) => updateItem(idx, 'sku', e.target.value)}
                    placeholder="品項名稱（例：排骨便當）"
                    className="input input-bordered input-sm flex-1"
                    required
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="input input-bordered input-sm w-20"
                  />
                  <span className="text-sm text-base-content/50 shrink-0">份</span>
                  {items.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm btn-circle text-base-content/30 hover:text-error" onClick={() => removeItem(idx)}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">送達方式</span>
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" className="radio radio-sm" checked={unservedPenalty === 'required'} onChange={() => setUnservedPenalty('required')} />
                <span className="text-sm">必送</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" className="radio radio-sm" checked={unservedPenalty === 'optional'} onChange={() => setUnservedPenalty('optional')} />
                <span className="text-sm">可略過</span>
              </label>
            </div>
            {unservedPenalty === 'optional' && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={penaltyValue}
                  onChange={(e) => setPenaltyValue(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="input input-bordered input-sm w-32"
                />
                <span className="text-xs text-base-content/50">略過懲罰值（公尺等效）</span>
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">備註（選填）</span>
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="選填"
              className="input input-bordered w-full"
            />
          </div>

          {error && (
            <div className="alert alert-error text-sm py-2"><span>{error}</span></div>
          )}

          <div className="modal-action mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary" disabled={createBentoOrder.isPending}>
              {createBentoOrder.isPending && <span className="loading loading-spinner loading-xs" />}
              建立訂單
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}><button>關閉</button></form>
    </dialog>
  )
}
