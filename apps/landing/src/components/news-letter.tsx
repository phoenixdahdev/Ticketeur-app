'use client'

import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { FaXTwitter } from 'react-icons/fa6'
import { LuInstagram } from 'react-icons/lu'
import { useState, useTransition } from 'react'
import { addToWaitlist } from '@/actions/waitlist'
import { Button } from '@useticketeur/ui/components/button'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await addToWaitlist(email).then((res) => {
          if (res.success) {
            toast.success(res.message)
            setEmail('')
          } else {
            toast.error(res.message)
          }
        })
      } catch {
        toast.error('An unexpected error occurred.')
      }
    })
  }

  return (
    <section className="bg-[#F4F1FF] py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="w-full md:w-1/2">
            <h3 className="mb-4 font-sans text-sm text-black lg:text-base">
              Join our waitlist to stay up to date on features and releases.
            </h3>
            <form onSubmit={handleSubmit} className="max-w-md gap-2 lg:flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full flex-1 rounded-2xl border border-[#E1E3EE] bg-white p-3 text-sm placeholder:font-sans focus:ring-2 focus:ring-purple-500 focus:outline-none lg:max-w-[260px]"
                required
              />
              <Button
                disabled={isPending}
                className="mt-5 w-full rounded-4xl p-5 font-sans text-xs font-bold text-white hover:animate-pulse lg:mt-0 lg:w-auto"
              >
                {isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  'Join the waitlist'
                )}
              </Button>
            </form>
            <p className="mt-4 font-sans text-xs text-black lg:max-w-sm lg:leading-5">
              By subscribing you agree to with our Privacy Policy and provide
              consent to receive updates from our company.
            </p>
          </div>

          <div className="w-full md:w-1/3">
            <h3 className="mb-4 font-mono text-sm font-bold lg:text-base">
              Follow Us
            </h3>
            <div className="flex flex-col gap-4">
              <a
                target="_blank"
                href="https://www.instagram.com/ticketeur?igsh=dWttNnNkbDMzNWY3&utm_source=qr"
                className="hover:text-primary flex items-center gap-4 font-sans text-black transition-colors"
              >
                <LuInstagram size={20} /> <span>Instagram</span>
              </a>
              <a
                target="_blank"
                href="https://x.com/ticketeur_?s=21&t=CwSCa3QnsIWHWk-WcWOiLw"
                className="hover:text-primary flex items-center gap-4 font-sans text-black transition-colors"
              >
                <FaXTwitter size={20} /> <span>X (formerly Twitter)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
