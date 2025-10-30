'use client'
import React from 'react'
import { useSession } from 'next-auth/react'

const Top = () => {
  const { data: session } = useSession()
  return (
    <div className="font-trap text-lg font-bold lg:text-2xl">
      Hi {session?.user?.first_name} {session?.user?.last_name}
    </div>
  )
}

export default Top
