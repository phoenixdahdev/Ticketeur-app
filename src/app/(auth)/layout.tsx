import Image from 'next/image'
import React, { Suspense } from 'react'
import BlurImage from '~/components/miscellaneous/blur-image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid h-screen w-full lg:grid-cols-2">
      <BlurImage
        src="/auth.png"
        alt="Ellum AI Login Illustration"
        width={687}
        height={1024}
        className="hidden h-full max-h-screen w-full object-cover lg:block"
      />
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
        <Image
          src="/logo.png"
          alt="Ticketeur Logo"
          width={135}
          height={50}
          className="mb-5 sm:hidden"
        />
        <Suspense>{children}</Suspense>
      </div>
    </div>
  )
}
