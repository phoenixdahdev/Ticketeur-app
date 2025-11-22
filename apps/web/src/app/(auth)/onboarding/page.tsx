import React from 'react'
import { auth } from '@/auth'
import BusinessVerification from './form'
import { get_use_by_id } from '../action'
import { redirect } from 'next/navigation'
import PendingReview from './pending-review'

const OnboardingPage = async () => {
  const session = await auth()
  const user = await get_use_by_id(session?.user.id!)

  if (user?.is_verified) {
    redirect('/dashboard')
  }

  const hasSubmittedDocuments =
    user?.registration_documents &&
    Array.isArray(user.registration_documents) &&
    user.registration_documents.length > 0

  if (hasSubmittedDocuments) {
    return <PendingReview />
  }

  return <BusinessVerification />
}

export default OnboardingPage
