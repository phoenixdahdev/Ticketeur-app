import type { Metadata } from 'next'

import { VendorProfileContent } from '@/components/vendor/profile-content'

export const metadata: Metadata = {
  title: 'Profile Settings',
  description:
    'Manage your professional business identity and online presence.',
}

export default function VendorProfilePage() {
  return <VendorProfileContent />
}
