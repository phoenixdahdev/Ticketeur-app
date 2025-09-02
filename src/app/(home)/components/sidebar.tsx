import Image from 'next/image'
import React from 'react'

const SideBar = () => {
  return (
    <div className="flex h-full w-[264px] shrink-0 flex-col items-start rounded-[24px] bg-[rgba(102,51,255,0.04)] py-8">
      <div className="flex w-full items-start justify-start px-6">
        <Image src="/logo.png" alt="Ticketeur Logo" width={132} height={50} />
      </div>
    </div>
  )
}

export default SideBar
