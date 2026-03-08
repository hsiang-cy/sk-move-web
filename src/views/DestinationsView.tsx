import { useRef, useState } from 'react'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { useDestinations, useDeleteDestination } from '@/hooks/useDestinations'
import DestinationFormModal from '@/components/destinations/DestinationFormModal'
import type { Destination } from '@/types'

export default function DestinationsView() {
  const { data: destinations = [], isLoading, error, refetch } = useDestinations()
  const deleteDestination = useDeleteDestination()

  const [showModal, setShowModal] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [deletingDestination, setDeletingDestination] = useState<Destination | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)

  function openCreate() {
    setEditingDestination(null)
    setShowModal(true)
  }

  function openEdit(dest: Destination) {
    setEditingDestination(dest)
    setShowModal(true)
  }

  function confirmDelete(dest: Destination) {
    setDeletingDestination(dest)
    deleteDialogRef.current?.showModal()
  }

  async function handleDelete() {
    if (!deletingDestination) return
    await deleteDestination.mutateAsync(deletingDestination.id)
    deleteDialogRef.current?.close()
    setDeletingDestination(null)
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">地點管理</h1>
          <p className="text-base-content/50 text-sm mt-1">新增與管理所有配送地點</p>
        </div>
        <button className="btn btn-primary gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          新增地點
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
                  <th className="font-semibold">地點名稱</th>
                  <th className="font-semibold">地址</th>
                  <th className="font-semibold">緯度</th>
                  <th className="font-semibold">經度</th>
                  <th className="font-semibold">備註</th>
                  <th className="font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {destinations.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
                        <MapPin className="w-10 h-10 mb-3 opacity-30" />
                        <p className="font-medium">尚無地點</p>
                        <p className="text-sm mt-1">點擊右上角「新增地點」開始建立</p>
                      </div>
                    </td>
                  </tr>
                ) : destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-base-50 border-b border-base-100 last:border-0">
                    <td className="font-medium">{dest.name}</td>
                    <td className="max-w-48">
                      <span className="block truncate text-sm text-base-content/70" title={dest.address}>
                        {dest.address}
                      </span>
                    </td>
                    <td className="text-xs font-mono text-base-content/60">{dest.lat}</td>
                    <td className="text-xs font-mono text-base-content/60">{dest.lng}</td>
                    <td className="text-sm text-base-content/60 max-w-32 truncate">
                      {dest.comment_for_account ?? '-'}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          className="btn btn-ghost btn-xs tooltip"
                          data-tip="編輯"
                          onClick={() => openEdit(dest)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error/60 hover:text-error tooltip"
                          data-tip="刪除"
                          onClick={() => confirmDelete(dest)}
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
          {destinations.length > 0 && (
            <div className="px-4 py-2.5 border-t border-base-200 text-xs text-base-content/40">
              共 {destinations.length} 筆地點
            </div>
          )}
        </div>
      )}

      <DestinationFormModal
        open={showModal}
        editData={editingDestination}
        onClose={() => setShowModal(false)}
      />

      <dialog ref={deleteDialogRef} className="modal" onClose={() => setDeletingDestination(null)}>
        <div className="modal-box max-w-sm">
          <h3 className="font-semibold text-base mb-2">確認刪除</h3>
          <p className="text-sm text-base-content/70">
            確定要刪除地點「<strong>{deletingDestination?.name}</strong>」嗎？此操作無法復原。
          </p>
          <div className="modal-action mt-5 pt-4 border-t border-base-200">
            <button className="btn btn-ghost btn-sm" onClick={() => deleteDialogRef.current?.close()}>取消</button>
            <button className="btn btn-error btn-sm" disabled={deleteDestination.isPending} onClick={handleDelete}>
              {deleteDestination.isPending && <span className="loading loading-spinner loading-xs" />}
              確認刪除
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>關閉</button></form>
      </dialog>
    </div>
  )
}
