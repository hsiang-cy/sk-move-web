// Destination
export interface Destination {
  id: string
  account_id: string
  status: 'inactive' | 'active' | 'deleted'
  name: string
  address: string
  lat: string
  lng: string
  data?: unknown
  comment_for_account: string | null
  created_at: number | null
  updated_at: number | null
}

// VehicleType
export interface VehicleType {
  id: string
  account_id: string
  status: 'inactive' | 'active' | 'deleted'
  name: string
  capacity: number
  data?: unknown
  comment_for_account: string | null
  created_at: number | null
  updated_at: number | null
}

// Vehicle
export interface Vehicle {
  id: string
  account_id: string
  status: 'inactive' | 'active' | 'deleted'
  vehicle_number: string
  vehicle_type: string  // UUID ref to VehicleType
  depot_id: string | null
  data?: unknown
  comment_for_account: string | null
  created_at: number | null
  updated_at: number | null
}

// BentoOrderItem
export interface BentoOrderItem {
  id: number
  bento_order_id: string
  sku: string
  quantity: number
}

// BentoOrder
export interface BentoOrder {
  id: string
  account_id: string
  status: 'inactive' | 'active' | 'deleted'
  pickup_location_id: string
  delivery_location_id: string
  unserved_penalty: number | null
  comment_for_account: string | null
  data?: unknown
  created_at: number | null
  updated_at: number | null
  items: BentoOrderItem[]
}

// Order
export interface Order {
  id: string
  account_id: string
  status: 'inactive' | 'active' | 'deleted'
  data?: unknown
  location_snapshot?: unknown
  bento_order_snapshot?: unknown
  vehicle_snapshot?: unknown
  comment_for_account: string | null
  created_at: number | null
  updated_at: number | null
}

// Compute
export type ComputeStatus = 'initial' | 'pending' | 'computing' | 'completed' | 'failed' | 'cancelled'

export interface Compute {
  id: string
  compute_one_click_id: string
  status: 'inactive' | 'active' | 'deleted'
  compute_status: ComputeStatus
  start_time: number | null
  end_time: number | null
  fail_reason: string | null
  algo_parameter?: unknown
  data?: unknown
  comment_for_account: string | null
  created_at: number | null
  updated_at: number | null
}

// RouteStop
export interface RouteStop {
  id: number
  route_id: string
  destination_id: string
  sequence: number
  arrival_time: number
  action: string
  bento_order_ids?: unknown
  created_at: number | null
  destination?: { name: string; address: string } | null
}

// RouteWithStops
export interface RouteWithStops {
  id: string
  compute_id: string
  vehicle_id: string
  status: 'inactive' | 'active' | 'deleted'
  total_distance: number
  total_time: number
  total_load: number
  created_at: number | null
  vehicle?: { vehicle_number: string } | null
  stops: RouteStop[]
}

// ComputeWithRoutes
export interface ComputeWithRoutes extends Compute {
  routes: RouteWithStops[]
}
