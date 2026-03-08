import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useCreateDestination, useUpdateDestination } from '@/hooks/useDestinations'
import type { Destination } from '@/types'

interface Props {
  open: boolean
  editData?: Destination | null
  onClose: () => void
}

interface FormData {
  name: string
  address: string
  lat: string
  lng: string
  comment_for_account: string
}

function defaultForm(): FormData {
  return { name: '', address: '', lat: '', lng: '', comment_for_account: '' }
}

export default function DestinationFormModal({ open, editData, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const createDestination = useCreateDestination()
  const updateDestination = useUpdateDestination()

  const [form, setForm] = useState<FormData>(defaultForm)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setSubmitError(null)
      setForm(editData ? {
        name: editData.name,
        address: editData.address,
        lat: editData.lat,
        lng: editData.lng,
        comment_for_account: editData.comment_for_account ?? '',
      } : defaultForm())
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open, editData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    try {
      const body = {
        name: form.name,
        address: form.address,
        lat: form.lat,
        lng: form.lng,
        comment_for_account: form.comment_for_account || undefined,
      }
      if (editData) {
        await updateDestination.mutateAsync({ id: editData.id, data: body })
      } else {
        await createDestination.mutateAsync(body)
      }
      onClose()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '儲存失敗，請稍後再試')
    }
  }

  const isSubmitting = createDestination.isPending || updateDestination.isPending

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box w-full max-w-lg max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">{editData ? '編輯地點' : '新增地點'}</h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">地點名稱 <span className="text-error">*</span></span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="例：台北倉庫"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">地址 <span className="text-error">*</span></span>
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="例：台北市信義區信義路五段7號"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium">緯度 <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                value={form.lat}
                onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                placeholder="25.0330"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium">經度 <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                value={form.lng}
                onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                placeholder="121.5654"
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">備註</span>
            </label>
            <input
              type="text"
              value={form.comment_for_account}
              onChange={(e) => setForm((f) => ({ ...f, comment_for_account: e.target.value }))}
              placeholder="選填"
              className="input input-bordered w-full"
            />
          </div>

          {submitError && (
            <div className="alert alert-error py-2.5 text-sm">
              <span>{submitError}</span>
            </div>
          )}

          <div className="modal-action mt-2 pt-2 border-t border-base-200">
            <button type="button" className="btn btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting && <span className="loading loading-spinner loading-xs" />}
              {editData ? '更新地點' : '新增地點'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop"><button>關閉</button></form>
    </dialog>
  )
}
