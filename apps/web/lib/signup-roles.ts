import { z } from 'zod'

export type SignupRole = 'attendee' | 'organizer' | 'vendor'

export type SignupFieldType = 'text' | 'email' | 'textarea' | 'select'

export type SignupField = {
  name: string
  label: string
  type: SignupFieldType
  placeholder: string
  autoComplete?: string
  options?: readonly string[]
}

export const ORG_TYPE_OPTIONS = [
  'Corporate',
  'Entertainment',
  'Social',
  'Religious',
  'Educational',
  'Other',
] as const

export const passwordSchema = z
  .string()
  .min(8, 'Minimum of 8 characters')
  .regex(/[^A-Za-z0-9\s]/, 'Add at least one special character (@#!)')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/[A-Z]/, 'Add an uppercase letter')

const agreeSchema = z
  .boolean()
  .refine((v) => v === true, 'Please accept the Terms and Privacy Policy')

const confirmPasswordSchema = z.string().min(1, 'Please confirm your password')

const passwordsMatch = {
  check: (data: { password: string; confirmPassword: string }) =>
    data.password === data.confirmPassword,
  options: { message: "Passwords don't match", path: ['confirmPassword'] },
}

const attendeeSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full name is required'),
    email: z.email('Enter a valid email'),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    agree: agreeSchema,
  })
  .refine(passwordsMatch.check, passwordsMatch.options)

const organizerSchema = z
  .object({
    orgName: z.string().trim().min(1, 'Organization name is required'),
    email: z.email('Enter a valid email'),
    orgType: z.enum(ORG_TYPE_OPTIONS, {
      message: 'Please choose an organization type',
    }),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    agree: agreeSchema,
  })
  .refine(passwordsMatch.check, passwordsMatch.options)

const vendorSchema = z
  .object({
    businessName: z.string().trim().min(1, 'Business name is required'),
    email: z.email('Enter a valid email'),
    category: z.string().trim().min(1, 'Business category is required'),
    description: z
      .string()
      .trim()
      .min(10, 'Add at least 10 characters describing your business'),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    agree: agreeSchema,
  })
  .refine(passwordsMatch.check, passwordsMatch.options)

export const SIGNUP_SCHEMAS = {
  attendee: attendeeSchema,
  organizer: organizerSchema,
  vendor: vendorSchema,
} as const

export type SignupValues = {
  attendee: z.infer<typeof attendeeSchema>
  organizer: z.infer<typeof organizerSchema>
  vendor: z.infer<typeof vendorSchema>
}

export type SignupRoleConfig = {
  role: SignupRole
  title: string
  description: string
  fields: SignupField[]
  imageSrc: string
  imageMobileSrc: string
  imageAlt: string
}

export const SIGNUP_ROLES: Record<SignupRole, SignupRoleConfig> = {
  attendee: {
    role: 'attendee',
    title: 'Join as an Attendee',
    description: 'Create your account to attend your next event with ease.',
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Alex Johnson',
        autoComplete: 'name',
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'alex@example.com',
        autoComplete: 'email',
      },
    ],
    imageSrc: '/auth/attendee-auth.png',
    imageMobileSrc: '/auth/attendee-auth-mobile.png',
    imageAlt: 'Attendees cheering at a live event',
  },
  organizer: {
    role: 'organizer',
    title: 'Join as an Organizer',
    description:
      'Create a professional host account for your next great event.',
    fields: [
      {
        name: 'orgName',
        label: 'Organization Name',
        type: 'text',
        placeholder: 'AI 2 UX',
        autoComplete: 'organization',
      },
      {
        name: 'email',
        label: 'Organization Email Address',
        type: 'email',
        placeholder: 'ai2ux@example.com',
        autoComplete: 'email',
      },
      {
        name: 'orgType',
        label: 'Organization Type',
        type: 'select',
        placeholder: 'Select organization type',
        options: ORG_TYPE_OPTIONS,
      },
    ],
    imageSrc: '/auth/org-auth.png',
    imageMobileSrc: '/auth/org-auth-mobile.png',
    imageAlt: 'Organizer hosting an event on stage',
  },
  vendor: {
    role: 'vendor',
    title: 'Join as a Vendor',
    description: 'Create a business account to start selling at events.',
    fields: [
      {
        name: 'businessName',
        label: 'Brand/Business Name',
        type: 'text',
        placeholder: 'Tasty bites',
        autoComplete: 'organization',
      },
      {
        name: 'email',
        label: 'Business Email Address',
        type: 'email',
        placeholder: 'tastybites@example.com',
        autoComplete: 'email',
      },
      {
        name: 'category',
        label: 'Business Category',
        type: 'text',
        placeholder: 'Food',
      },
      {
        name: 'description',
        label: 'Short Business Description',
        type: 'textarea',
        placeholder: 'Tell us what you sell or offer',
      },
    ],
    imageSrc: '/auth/vendor-auth.png',
    imageMobileSrc: '/auth/vendor-auth-mobile.png',
    imageAlt: 'Vendor selling products at an event booth',
  },
}

export function resolveSignupRole(
  raw: string | string[] | undefined
): SignupRoleConfig {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (value && value in SIGNUP_ROLES) {
    return SIGNUP_ROLES[value as SignupRole]
  }
  return SIGNUP_ROLES.attendee
}

export function getSignupDefaultValues(
  config: SignupRoleConfig
): Record<string, string | boolean> {
  const defaults: Record<string, string | boolean> = {}
  for (const field of config.fields) {
    defaults[field.name] = ''
  }
  defaults.password = ''
  defaults.confirmPassword = ''
  defaults.agree = false
  return defaults
}
