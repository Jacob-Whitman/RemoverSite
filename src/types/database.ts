// Auto-generated types should come from `supabase gen types typescript`
// These hand-written types mirror the migration schema as a starting point.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      consent_records: {
        Row: ConsentRecord
        Insert: Omit<ConsentRecord, 'id' | 'created_at'>
        Update: Partial<Pick<ConsentRecord, 'revoked_at'>>
      }
      brokers: {
        Row: Broker
        Insert: Omit<Broker, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Broker, 'id' | 'created_at'>>
      }
      broker_tasks: {
        Row: BrokerTask
        Insert: Omit<BrokerTask, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BrokerTask, 'id' | 'user_id' | 'broker_id' | 'created_at'>>
      }
      reports: {
        Row: Report
        Insert: Omit<Report, 'id' | 'created_at'>
        Update: never
      }
      deletion_requests: {
        Row: DeletionRequest
        Insert: Omit<DeletionRequest, 'id' | 'requested_at'>
        Update: Partial<Pick<DeletionRequest, 'status' | 'completed_at' | 'notes'>>
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'>
        Update: never
      }
    }
  }
}

export interface Profile {
  id: string
  email: string | null
  legal_first_name: string | null
  legal_middle_name: string | null
  legal_last_name: string | null
  current_city: string | null
  current_state: string | null
  aliases: string[]
  year_of_birth: string | null
  phone_numbers: string[]
  alternate_emails: string[]
  current_address: AddressRecord | null
  previous_addresses: AddressRecord[]
  known_relatives: RelativeRecord[]
  employer_or_business: string | null
  public_facing_professional: boolean
  household_removal_interest: boolean
  recurring_monitoring_interest: boolean
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface AddressRecord {
  street?: string
  city: string
  state: string
  zip?: string
}

export interface RelativeRecord {
  name: string
  relationship?: string
}

export interface ConsentRecord {
  id: string
  user_id: string
  consent_type: ConsentType
  consent_text_version: string
  consent_given: boolean
  ip_address: string | null
  user_agent: string | null
  created_at: string
  revoked_at: string | null
}

export type ConsentType =
  | 'process_personal_data'
  | 'submit_opt_out_requests'
  | 'contact_brokers_on_user_behalf'
  | 'store_evidence'
  | 'recurring_monitoring'
  | 'terms_of_service'
  | 'privacy_policy'

export interface Broker {
  id: string
  name: string
  website_url: string | null
  opt_out_url: string | null
  category: string | null
  priority: 'high' | 'medium' | 'low'
  country_region: string
  source_reference: string | null
  requires_email_verification: boolean
  requires_phone_verification: boolean
  requires_id_verification: boolean
  requires_payment: boolean
  supports_automation: boolean
  automation_method: string
  manual_instructions: string | null
  required_fields: string[]
  difficulty_score: number
  estimated_days: number | null
  active: boolean
  last_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface BrokerTask {
  id: string
  user_id: string
  broker_id: string
  status: BrokerTaskStatus
  match_confidence: MatchConfidence
  found_record_url: string | null
  exposed_fields_summary: Record<string, unknown>
  submitted_at: string | null
  last_checked_at: string | null
  removed_at: string | null
  reappeared_at: string | null
  failure_reason: string | null
  requires_user_action: boolean
  user_action_type: string | null
  proxy_email: string | null
  assigned_admin_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  broker?: Broker
}

export type BrokerTaskStatus =
  | 'not_started'
  | 'not_found'
  | 'record_found'
  | 'submitted'
  | 'waiting_user_action'
  | 'waiting_broker_response'
  | 'removed'
  | 'manual_intervention_required'
  | 'failed'
  | 'reappeared'

export type MatchConfidence = 'not_searched' | 'low' | 'medium' | 'high' | 'confirmed'

export interface Report {
  id: string
  user_id: string
  report_month: string
  brokers_checked: number
  records_found: number
  removals_submitted: number
  confirmed_removed: number
  pending_count: number
  user_action_required_count: number
  reappeared_count: number
  report_data: Record<string, unknown>
  created_at: string
}

export interface DeletionRequest {
  id: string
  user_id: string
  request_type: string
  status: 'pending' | 'in_progress' | 'completed' | 'denied'
  requested_at: string
  completed_at: string | null
  notes: string | null
}

export interface ActivityLog {
  id: string
  user_id: string | null
  actor_type: string
  actor_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  metadata: Record<string, unknown>
  ip_address: string | null
  created_at: string
}
