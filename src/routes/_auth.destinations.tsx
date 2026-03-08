import { createFileRoute } from '@tanstack/react-router'
import DestinationsView from '@/views/DestinationsView'

export const Route = createFileRoute('/_auth/destinations')({
  component: DestinationsView,
})
