import { Badge } from '../ui/Badge'
import { getStatusConfig } from '../../lib/status'
import type { BrokerTaskStatus } from '../../types/database'

interface StatusBadgeProps {
  status: BrokerTaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = getStatusConfig(status)
  return <Badge variant={config.variant}>{config.label}</Badge>
}
