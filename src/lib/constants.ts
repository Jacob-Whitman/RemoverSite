export const APP_NAME = 'Baseline Solutions'
export const APP_TAGLINE = 'Confidential Data Broker Removal for Law Enforcement'

export const CONSENT_VERSION = 'v1.0'

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
  'DC',
]

export const ROLE_OPTIONS = [
  { value: 'police_officer', label: 'Police Officer' },
  { value: 'family_member', label: 'Family Member' },
  { value: 'first_responder', label: 'First Responder' },
  { value: 'department_representative', label: 'Department Representative' },
  { value: 'other', label: 'Other' },
]

export const SUPABASE_FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ''}/functions/v1`
