import { z } from 'zod'
import { US_STATES } from './constants'

export const emailSchema = z.string().trim().email('Please enter a valid email address')

export const signupSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const intakeSchema = z.object({
  legal_first_name: z.string().trim().min(1, 'First name is required'),
  legal_middle_name: z.string().trim().optional(),
  legal_last_name: z.string().trim().min(1, 'Last name is required'),
  email: emailSchema,
  current_city: z.string().trim().min(1, 'City is required'),
  current_state: z.enum(US_STATES as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid US state' }),
  }),
  aliases: z.array(z.string().trim()).optional(),
  year_of_birth: z.string().trim().regex(/^\d{4}$/, 'Enter a 4-digit year').optional().or(z.literal('')),
  phone_numbers: z.array(z.string().trim()).optional(),
  alternate_emails: z.array(emailSchema).optional(),
  employer_or_business: z.string().trim().optional(),
  public_facing_professional: z.boolean().optional(),
  household_removal_interest: z.boolean().optional(),
  recurring_monitoring_interest: z.boolean().optional(),
})

export const consentSchema = z.object({
  process_personal_data: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  submit_opt_out_requests: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  contact_brokers_on_user_behalf: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  store_evidence: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  terms_of_service: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  privacy_policy: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  recurring_monitoring: z.boolean().optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: emailSchema,
  role: z.string().min(1, 'Please select your role'),
  state: z.enum(US_STATES as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a state' }),
  }),
  message: z.string().trim().min(10, 'Please provide a brief message').max(2000),
  turnstileToken: z.string().min(1, 'Please complete the security check'),
})

export const deletionRequestSchema = z.object({
  request_type: z.enum(['full_account_deletion', 'profile_data_only', 'consent_revocation']),
  confirmation: z.literal(true, { errorMap: () => ({ message: 'You must confirm to proceed' }) }),
})

export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type IntakeFormData = z.infer<typeof intakeSchema>
export type ConsentFormData = z.infer<typeof consentSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type DeletionRequestFormData = z.infer<typeof deletionRequestSchema>
