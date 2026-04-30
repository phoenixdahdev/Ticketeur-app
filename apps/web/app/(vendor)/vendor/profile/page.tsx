import type { Metadata } from 'next'

import { getSession } from '@/lib/auth'
import { VendorProfileContent } from '@/components/vendor/profile-content'
import {
  VENDOR_PROFILE_DEFAULTS,
  type VendorProfileValues,
} from '@/lib/vendor-profile-schema'

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your professional business identity and online presence.',
}

type VendorUserExtras = {
  businessName?: string | null
  businessCategory?: string | null
  businessDescription?: string | null
  image?: string | null
}

export default async function VendorProfilePage() {
  const session = await getSession()
  const u = (session?.user ?? {}) as unknown as VendorUserExtras
  const initialValues: VendorProfileValues = {
    ...VENDOR_PROFILE_DEFAULTS,
    businessName: u.businessName ?? '',
    businessCategory: u.businessCategory ?? '',
    businessDescription: u.businessDescription ?? '',
    logoUrl: u.image ?? null,
  }

  return <VendorProfileContent initialValues={initialValues} />
}
