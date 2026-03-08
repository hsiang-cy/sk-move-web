import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useVehicleTypes } from '@/hooks/useVehicleTypes'
import { useDestinations } from '@/hooks/useDestinations'
import { useCreateVehicle, useUpdateVehicle } from '@/hooks/useVehicles'
import type { Vehicle } from '@/types'

interface Props {
  open: boolean
  editData?: Vehicle | null
  onClose: () => void
}

interface FormData {
  vehicle_number: string
  vehicle_type: string
  depot_id: string
  comment_for_account: string
}

function defaultForm(): FormData {
  return { vehicle_number: '', vehicle_type: '', depot_id: '', comment_for_account: '' }
}

export default function VehicleFormModal({ open, editData, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { data: vehicleTypes = [] } = useVehicleTypes()
  const { data: destinations = [] } = useDestinations()
  const createVehicle = useCreateVehicle()
  const updateVehicle = useUpdateVehicle()

  const [form, setForm] = useState<FormData>(defaultForm)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setSubmitError(null)
      setForm(editData ? {
        vehicle_number: editData.vehicle_number,
        vehicle_type: editData.vehicle_type,
        depot_id: editData.depot_id ?? '',
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
        vehicle_number: form.vehicle_number,
        vehicle_type: form.vehicle_type,
        depot_id: form.depot_id || undefined,
        comment_for_account: form.comment_for_account || undefined,
      }
      if (editData) {
        await updateVehicle.mutateAsync({ id: editData.id, data: { ...body, depot_id: form.depot_id || null } })
      } else {
        await createVehicle.mutateAsync(body)
      }
      onClose()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '儲存失敗，請稍後再試')
    }
  }

  const isSubmitting = createVehicle.isPending || updateVehicle.isPending

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box w-full max-w-lg max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">{editData ? '編輯車輛' : '新增車輛'}</h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">車號 <span className="text-error">*</span></span>
            </label>
            <input
              type="text"
              value={form.vehicle_number}
              onChange={(e) => setForm((f) => ({ ...f, vehicle_number: e.target.value }))}
              placeholder="例：ABC-1234"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">車輛類型 <span className="text-error">*</span></span>
            </label>
            <select
              value={form.vehicle_type}
              onChange={(e) => setForm((f) => ({ ...f, vehicle_type: e.target.value }))}
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>請選擇車輛類型</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}（容量 {type.capacity}）</option>
              ))}
            </select>
            {vehicleTypes.length === 0 && (
              <label className="label pb-0">
                <span className="label-text-alt text-warning">尚未建立任何車輛類型，請先至「車輛類型」頁面新增</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">預設出發地（選填）</span>
            </label>
            <select
              value={form.depot_id}
              onChange={(e) => setForm((f) => ({ ...f, depot_id: e.target.value }))}
              className="select select-bordered w-full"
            >
              <option value="">無（不設定）</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">備註（選填）</span>
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
              {editData ? '更新車輛' : '新增車輛'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop"><button>關閉</button></form>
    </dialog>
  )
}
