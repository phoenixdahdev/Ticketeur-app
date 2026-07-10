import type { Metadata } from 'next'

import { OrgProfileContent } from '@/components/dashboard/org-profile-content'

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your organizer account and organization details.',
}

export default function OrgProfilePage() {
  return <OrgProfileContent />
}
