import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-[#F4F1FF] py-12">
      <div className="container mx-auto border-t px-4 md:px-6 lg:pt-20">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-8 flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="logo.png"
              width={122}
              height={38}
              className="h-12.5 w-50 object-contain hover:animate-pulse lg:h-25 lg:w-100"
            />
          </div>

          <p className="mb-6 font-sans text-xs text-black">
            © {new Date().getFullYear()} Ticketeur. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
