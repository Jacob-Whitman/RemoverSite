import type { BrokerTaskStatus } from '../types/database'

export interface StatusConfig {
  label: string
  variant: 'neutral' | 'info' | 'warning' | 'success' | 'danger' | 'amber'
}

export const STATUS_CONFIG: Record<BrokerTaskStatus, StatusConfig> = {
  not_started:                 { label: 'Not checked yet',      variant: 'neutral'  },
  not_found:                   { label: 'No record found',      variant: 'success'  },
  record_found:                { label: 'Record found',         variant: 'warning'  },
  submitted:                   { label: 'Removal submitted',    variant: 'info'     },
  waiting_user_action:         { label: 'Waiting on you',       variant: 'amber'    },
  waiting_broker_response:     { label: 'Waiting on broker',    variant: 'info'     },
  removed:                     { label: 'Removed',              variant: 'success'  },
  manual_intervention_required:{ label: 'Needs manual help',    variant: 'amber'    },
  failed:                      { label: 'Failed',               variant: 'danger'   },
  reappeared:                  { label: 'Reappeared',           variant: 'danger'   },
}

export function getStatusConfig(status: BrokerTaskStatus): StatusConfig {
  return STATUS_CONFIG[status] ?? { label: status, variant: 'neutral' }
}
