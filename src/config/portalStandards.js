export const ROLES = ['admin', 'pm', 'client']

export const PROJECT_STATUSES = [
  'planned',
  'active',
  'on-hold',
  'completed',
  'cancelled',
]

export const PROJECT_REQUIRED_FIELDS = [
  'title',
  'clientId',
  'pmId',
  'status',
  'progressPct',
  'startDate',
  'dueDate',
  'priority',
  'riskLevel',
]

export const PROJECT_PRIORITIES = ['low', 'medium', 'high', 'critical']
export const PROJECT_RISK_LEVELS = ['low', 'medium', 'high']

export const SCHEDULE_MILESTONES = [
  'ingenieria',
  'procurement',
  'fabricacion',
  'integracion',
  'fat_sat',
  'cierre',
]

export const DESIGNPRO_FLOW = [
  'client_config_submitted',
  'preview_generated',
  'request_saved',
  'pm_review',
  'final_quote_sent',
]

export const INVITE_DEFAULT_EXPIRY_HOURS = 72
