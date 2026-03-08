import { useState } from 'react'
import { Plus, Eye, AlertTriangle, Cpu, X, RotateCcw } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_auth.computes'
import { useComputes } from '@/hooks/useComputes'
import { useOrders } from '@/hooks/useOrders'
import ComputeFormModal from '@/components/computes/ComputeFormModal'
import RouteListModal from '@/components/computes/RouteListModal'
import { formatTimestamp } from '@/lib/utils'
import type { Compute, ComputeStatus } from '@/types'

const STATUS_LABEL: Record<ComputeStatus, string> = {
  initial:   '初始',
  pending:   '等待中',
  computing: '計算中',
  completed: '已完成',
  failed:    '失敗',
  cancelled: '已取消',
}

const STATUS_BADGE: Record<ComputeStatus, string> = {
  initial:   'badge-ghost',
  pending:   'badge-warning',
  computing: 'badge-info',
  completed: 'badge-success',
  failed:    'badge-error',
  cancelled: 'badge-ghost',
}

function formatDuration(start: number | null, end: number | null): string {
  if (!start || !end) return '-'
  const secs = end - start
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}分${String(s).padStart(2, '0')}秒`
}

export default function ComputesView() {
  const { orderId } = Route.useSearch()
  const navigate = useNavigate()
  const { data: orders = [] } = useOrders()
  const { data: computes = [], isLoading, error, refetch } = useComputes(orderId)

  const [showFormModal, setShowFormModal] = useState(false)
  const [viewRouteCompute, setViewRouteCompute] = useState<Compute | null>(null)

  function clearFilter() {
    navigate({ to: '/computes', search: { orderId: undefined } })
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">計算任務</h1>
          <p className="text-base-content/50 text-sm mt-1">觸發與追蹤路線最佳化計算</p>
        </div>
        <button className="btn btn-primary gap-2" onClick={() => setShowFormModal(true)}>
          <Plus className="w-4 h-4" />
          觸發計算
        </button>
      </div>

      {/* Order selector or active filter banner */}
      {!orderId ? (
        <div className="mb-4">
          <div className="form-control max-w-sm">
            <label className="label pt-0">
              <span className="label-text text-sm">選擇訂單以查看計算任務</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value=""
              onChange={(e) => {
                if (e.target.value) navigate({ to: '/computes', search: { orderId: e.target.value } })
              }}
            >
              <option value="">請選擇訂單...</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id.slice(0, 8)}...{o.comment_for_account ? ` — ${o.comment_for_account}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="alert alert-info mb-4 py-2">
          <span className="text-sm">篩選中：訂單 <strong className="font-mono">{orderId.slice(0, 8)}...</strong></span>
          <button className="btn btn-ghost btn-xs gap-1" onClick={clearFilter}>
            <X className="w-3 h-3" />清除篩選
          </button>
        </div>
      )}

      {orderId && isLoading && (
        <div className="flex justify-center items-center py-16">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      )}

      {orderId && !isLoading && error && (
        <div className="alert alert-error">
          <span>{error.message}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => refetch()}>重試</button>
        </div>
      )}

      {orderId && !isLoading && !error && (
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-b border-base-200 bg-base-50 text-xs text-base-content/60 uppercase tracking-wider">
                  <th className="font-semibold">計算 ID</th>
                  <th className="font-semibold">狀態</th>
                  <th className="font-semibold">建立時間</th>
                  <th className="font-semibold">耗時</th>
                  <th className="font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {computes.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
                        <Cpu className="w-10 h-10 mb-3 opacity-30" />
                        <p className="font-medium">此訂單尚無計算任務</p>
                        <p className="text-sm mt-1">點擊右上角「觸發計算」開始</p>
                      </div>
                    </td>
                  </tr>
                ) : computes.map((compute) => (
                  <tr key={compute.id} className="hover:bg-base-50 border-b border-base-100 last:border-0">
                    <td className="font-mono text-sm">{compute.id.slice(0, 8)}...</td>
                    <td>
                      <span className={`badge badge-sm ${STATUS_BADGE[compute.compute_status]}`}>
                        {STATUS_LABEL[compute.compute_status]}
                        {(compute.compute_status === 'pending' || compute.compute_status === 'computing') && (
                          <span className="loading loading-dots loading-xs ml-1" />
                        )}
                      </span>
                    </td>
                    <td className="text-sm">{formatTimestamp(compute.created_at)}</td>
                    <td className="text-sm">{formatDuration(compute.start_time, compute.end_time)}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {compute.compute_status === 'completed' && (
                          <button
                            className="btn btn-ghost btn-xs tooltip"
                            data-tip="查看路線"
                            onClick={() => setViewRouteCompute(compute)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {compute.compute_status === 'failed' && compute.fail_reason && (
                          <span
                            className="btn btn-ghost btn-xs text-error/60 tooltip tooltip-left"
                            data-tip={compute.fail_reason}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {computes.length > 0 && (
            <div className="px-4 py-2.5 border-t border-base-200 text-xs text-base-content/40 flex items-center gap-2">
              共 {computes.length} 筆計算任務
              <button className="btn btn-ghost btn-xs gap-1" onClick={() => refetch()}>
                <RotateCcw className="w-3 h-3" />重新整理
              </button>
            </div>
          )}
        </div>
      )}

      <ComputeFormModal open={showFormModal} defaultOrderId={orderId} onClose={() => setShowFormModal(false)} />

      <RouteListModal
        open={viewRouteCompute !== null}
        compute={viewRouteCompute}
        onClose={() => setViewRouteCompute(null)}
      />
    </div>
  )
}
