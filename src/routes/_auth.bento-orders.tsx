import { createFileRoute } from '@tanstack/react-router'
import BentoOrdersView from '@/views/BentoOrdersView'

export const Route = createFileRoute('/_auth/bento-orders')({
  component: BentoOrdersView,
})
