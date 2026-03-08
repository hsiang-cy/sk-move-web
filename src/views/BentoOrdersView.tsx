import { useRef, useState } from 'react'
import { Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useBentoOrders, useDeleteBentoOrder } from '@/hooks/useBentoOrders'
import { useDestinations } from '@/hooks/useDestinations'
import BentoOrderFormModal from '@/components/orders/BentoOrderFormModal'
import { formatTimestamp } from '@/lib/utils'
import type { BentoOrder } from '@/types'

export default function BentoOrdersView() {
  const { data: orders = [], isLoading, error, refetch } = useBentoOrders()
  const { data: destinations = [] } = useDestinations()
  const deleteOrder = useDeleteBentoOrder()

  const [showModal, setShowModal] = useState(false)
  const [deletingOrder, setDeletingOrder] = useState<BentoOrder | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)

  function getDestName(id: string) {
    return destinations.find((d) => d.id === id)?.name ?? id.slice(0, 8) + '...'
  }

  function confirmDelete(order: BentoOrder) {
    setDeletingOrder(order)
    deleteDialogRef.current?.showModal()
  }

  async function handleDelete() {
    if (!deletingOrder) return
    await deleteOrder.mutateAsync(deletingOrder.id)
    deleteDialogRef.current?.close()
    setDeletingOrder(null)
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">便當訂單</h1>
          <p className="text-base-content/50 text-sm mt-1">管理取餐與送餐任務</p>
        </div>
        <button className="btn btn-primary gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          新增訂單
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-error">
          <span>{error.message}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => refetch()}>重試</button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-b border-base-200 bg-base-50 text-xs text-base-content/60 uppercase tracking-wider">
                  <th className="font-semibold">取餐地點</th>
                  <th className="font-semibold">送餐地點</th>
                  <th className="font-semibold">品項數</th>
                  <th className="font-semibold">可略過懲罰</th>
                  <th className="font-semibold">備註</th>
                  <th className="font-semibold">建立時間</th>
                  <th className="font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
                        <ShoppingBag className="w-10 h-10 mb-3 opacity-30" />
                        <p className="font-medium">尚無便當訂單</p>
                        <p className="text-sm mt-1">點擊右上角「新增訂單」開始建立</p>
                      </div>
                    </td>
                  </tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-base-50 border-b border-base-100 last:border-0">
                    <td className="font-medium">{getDestName(order.pickup_location_id)}</td>
                    <td className="font-medium">{getDestName(order.delivery_location_id)}</td>
                    <td className="text-sm">{order.items.length} 項</td>
                    <td className="text-sm">
                      {order.unserved_penalty === null ? (
                        <span className="badge badge-error badge-sm">必送</span>
                      ) : (
                        <span className="badge badge-ghost badge-sm">{order.unserved_penalty}</span>
                      )}
                    </td>
                    <td className="text-sm text-base-content/60 max-w-32 truncate">
                      {order.comment_for_account ?? '-'}
                    </td>
                    <td className="text-sm">{formatTimestamp(order.created_at)}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          className="btn btn-ghost btn-xs text-error/60 hover:text-error tooltip"
                          data-tip="刪除"
                          onClick={() => confirmDelete(order)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length > 0 && (
            <div className="px-4 py-2.5 border-t border-base-200 text-xs text-base-content/40">
              共 {orders.length} 筆便當訂單
            </div>
          )}
        </div>
      )}

      <BentoOrderFormModal open={showModal} onClose={() => setShowModal(false)} />

      <dialog ref={deleteDialogRef} className="modal" onClose={() => setDeletingOrder(null)}>
        <div className="modal-box max-w-sm">
          <h3 className="font-semibold text-base mb-2">確認刪除</h3>
          <p className="text-sm text-base-content/70">
            確定要刪除此便當訂單嗎？此操作無法復原。
          </p>
          <div className="modal-action mt-5 pt-4 border-t border-base-200">
            <button className="btn btn-ghost btn-sm" onClick={() => deleteDialogRef.current?.close()}>取消</button>
            <button className="btn btn-error btn-sm" disabled={deleteOrder.isPending} onClick={handleDelete}>
              {deleteOrder.isPending && <span className="loading loading-spinner loading-xs" />}
              確認刪除
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>關閉</button></form>
      </dialog>
    </div>
  )
}
