'use client'
import React from 'react'
import { useSession } from 'next-auth/react'

const Top = () => {
  const { data: session } = useSession()
  return <div>Top</div>
}

export default Top
