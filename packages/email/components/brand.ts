export const BRAND_URL = 'https://www.useticketeur.com'
export const BRAND_NAME = 'Ticketeur'
export const BRAND_NAME_UPPER = 'TICKETEUR'
export const BRAND_EMAIL_ASSETS = `${BRAND_URL}/email`
export const BRAND_FONT_BASE = `${BRAND_URL}/fonts/trap`

export const SOCIALS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/useticketeur',
    icon: 'facebook.png',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/useticketeur',
    icon: 'github.png',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/useticketeur',
    icon: 'linkedin.png',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/useticketeur',
    icon: 'instagram.png',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@useticketeur',
    icon: 'youtube.png',
  },
] as const

export const LEGAL_LINKS = [
  { label: 'Privacy policy', href: `${BRAND_URL}/privacy` },
  { label: 'Terms of service', href: `${BRAND_URL}/terms` },
  { label: 'Help center', href: `${BRAND_URL}/help` },
  { label: 'Unsubscribe', href: `${BRAND_URL}/unsubscribe` },
] as const
