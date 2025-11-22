'use client'

import Breadcrumb from '@/components/miscellaneous/bread-crumb'
import { TypewriterEffectSmooth } from '@useticketeur/ui/typewriter-effect'
import { Button } from '@useticketeur/ui/button'
import { Input } from '@useticketeur/ui/input'
import { Textarea } from '@useticketeur/ui/textarea'
import { Select, SelectTrigger, SelectValue } from '@useticketeur/ui/select'
import { useEventStore } from '@/hooks/use-event-store'
import { useTransition } from 'react'
import { useRouter } from '@bprogress/next/app'
import Link from 'next/link'
import { Copy } from 'lucide-react'
import { createEvent } from '../action'
import { toast } from 'sonner'

function PreviewSection({
  title,
  editHref,
  children,
}: {
  title: string
  editHref: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-5 rounded-xl border border-[#dfdfdf] bg-[#fcfcfc] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-transforma-sans text-sm font-bold">{title}</h3>
        <Link href={editHref}>
          <Button variant="outline" size="sm" className="text-xs">
            Edit
          </Button>
        </Link>
      </div>
      {children}
    </div>
  )
}

function PreviewField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="font-transforma-sans mb-1 text-xs font-bold text-gray-600">
        {label}
      </p>
      {children}
    </div>
  )
}

function ImagePlaceholder() {
  return (
    <div className="h-32 w-full rounded-lg bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat" />
  )
}

export default function PreviewPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { basicDetails, venue, sessions, ticketTypes, members, resetStore } =
    useEventStore()

  const words = [
    {
      text: 'Overview',
      className: 'font-sans text-sm',
    },
  ]

  function handleSubmit() {
    startTransition(async () => {
      const result = await createEvent({
        basicDetails,
        venue,
        sessions,
        ticketTypes,
        members,
      })

      if (result.success) {
        toast.success('Event created successfully!')
        resetStore()
        router.push('/events')
      } else {
        toast.error(result.error || 'Failed to create event')
      }
    })
  }

  return (
    <div className="">
      <Breadcrumb
        items={[
          { label: 'One', href: '/events/create' },
          { label: 'Two', href: '/events/create/agenda' },
          { label: 'Three', href: '/events/create/tickets' },
          { label: 'Four', href: '/events/create/roles' },
          { label: 'Five', isCurrent: true },
        ]}
      />
      <TypewriterEffectSmooth words={words} cursorClassName="hidden" />

      {/* Basic Details Section */}
      <PreviewSection title="Basic Details" editHref="/events/create">
        <div className="grid gap-5 lg:grid-cols-2">
          <PreviewField label="Event Image">
            {basicDetails.banner_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={basicDetails.banner_image}
                alt="Event banner"
                className="h-32 w-full rounded-lg object-cover"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </PreviewField>

          <PreviewField label="Event Description">
            <Textarea
              value={basicDetails.description || 'Example'}
              readOnly
              className="min-h-32 resize-none border-[#ccd0de] bg-white"
            />
          </PreviewField>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <PreviewField label="Event Title">
            <Input
              value={basicDetails.title || 'Example'}
              readOnly
              className="border-[#ccd0de] bg-white"
            />
          </PreviewField>

          <PreviewField label="Event Type">
            <Select value={basicDetails.event_type} disabled>
              <SelectTrigger className="w-full border-[#ccd0de] bg-white py-6">
                <SelectValue placeholder="Example Content" />
              </SelectTrigger>
            </Select>
          </PreviewField>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <PreviewField label="Event Start Date">
            <Input
              value={
                basicDetails.start_date
                  ? basicDetails.start_date.toLocaleDateString()
                  : 'Example Content'
              }
              readOnly
              className="border-[#ccd0de] bg-white"
            />
          </PreviewField>

          <PreviewField label="Event End Date">
            <Input
              value={
                basicDetails.end_date
                  ? basicDetails.end_date.toLocaleDateString()
                  : 'Example Content'
              }
              readOnly
              className="border-[#ccd0de] bg-white"
            />
          </PreviewField>
        </div>
      </PreviewSection>

      {/* Event & Agenda Section */}
      <PreviewSection title="Event & Agenda" editHref="/events/create/agenda">
        <div className="grid gap-5 lg:grid-cols-2">
          <PreviewField label="Venue Type">
            <Select value={venue.venue_name || ''} disabled>
              <SelectTrigger className="w-full border-[#ccd0de] bg-white py-6">
                <SelectValue placeholder="Example Content" />
              </SelectTrigger>
            </Select>
          </PreviewField>

          <PreviewField label="Address">
            <div className="relative">
              <Input
                value={venue.venue_address || 'Example Content'}
                readOnly
                className="border-[#ccd0de] bg-white pr-10"
              />
              <Copy className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400" />
            </div>
          </PreviewField>
        </div>

        <h4 className="font-transforma-sans mt-5 text-sm font-bold">
          Agenda Builder
        </h4>

        {sessions.map((session, index) => (
          <div
            key={index}
            className="mt-4 rounded-lg border border-[#e5e5e5] bg-white p-4"
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <PreviewField label="Title">
                <Input
                  value={session.title || 'Example'}
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="Track">
                <Select value={session.track || ''} disabled>
                  <SelectTrigger className="w-full border-[#ccd0de] bg-white py-6">
                    <SelectValue placeholder="Example Content" />
                  </SelectTrigger>
                </Select>
              </PreviewField>

              <PreviewField label="Start Time">
                <Input
                  value={
                    session.start_time
                      ? session.start_time.toLocaleDateString()
                      : 'Example Content'
                  }
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="End Time">
                <Input
                  value={
                    session.end_time
                      ? session.end_time.toLocaleDateString()
                      : 'Example Content'
                  }
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="Speaker Name">
                <Input
                  value={session.speaker_name || 'Example'}
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="Speaker Image">
                {session.speaker_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.speaker_image}
                    alt="Speaker"
                    className="h-24 w-36 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-24 w-36 rounded-lg bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat" />
                )}
              </PreviewField>
            </div>
          </div>
        ))}
      </PreviewSection>

      {/* Ticketing & Access Section */}
      <PreviewSection
        title="Ticketing & Access"
        editHref="/events/create/tickets"
      >
        {ticketTypes.map((ticket, index) => (
          <div
            key={index}
            className="mb-4 rounded-lg border border-[#e5e5e5] bg-white p-4 last:mb-0"
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <PreviewField label="Ticket Name">
                <Input
                  value={ticket.name || 'Example'}
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="Price">
                <Input
                  value={ticket.price || 'Example'}
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="Sales Start Time">
                <Input
                  value={
                    ticket.sales_start
                      ? ticket.sales_start.toLocaleDateString()
                      : 'Example Content'
                  }
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="Sales End Time">
                <Input
                  value={
                    ticket.sales_end
                      ? ticket.sales_end.toLocaleDateString()
                      : 'Example Content'
                  }
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>
            </div>

            <div className="mt-5">
              <PreviewField label="Benefits">
                <Textarea
                  value={
                    ticket.benefits.length > 0
                      ? ticket.benefits.join('\n')
                      : 'Input Label'
                  }
                  readOnly
                  className="min-h-24 resize-none border-[#ccd0de] bg-white"
                />
              </PreviewField>
            </div>
          </div>
        ))}
      </PreviewSection>

      {/* Roles Section */}
      <PreviewSection title="Roles" editHref="/events/create/roles">
        {members.map((member, index) => (
          <div
            key={index}
            className="mb-4 rounded-lg border border-[#e5e5e5] bg-white p-4 last:mb-0"
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <PreviewField label="Team Member Name">
                <Input
                  value={member.name || 'Example'}
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="Email Address">
                <Input
                  value={member.email || 'Example'}
                  readOnly
                  className="border-[#ccd0de] bg-white"
                />
              </PreviewField>

              <PreviewField label="Role">
                <Select value={member.role || ''} disabled>
                  <SelectTrigger className="w-full border-[#ccd0de] bg-white py-6">
                    <SelectValue placeholder="Example Content" />
                  </SelectTrigger>
                </Select>
              </PreviewField>

              <PreviewField label="Permissions">
                <Select value={member.permissions[0] || ''} disabled>
                  <SelectTrigger className="w-full border-[#ccd0de] bg-white py-6">
                    <SelectValue placeholder="Example Content" />
                  </SelectTrigger>
                </Select>
              </PreviewField>
            </div>
          </div>
        ))}
      </PreviewSection>

      {/* Submit Button */}
      <div className="mt-8 flex items-center justify-end">
        <Button
          onClick={handleSubmit}
          className="h-12 w-auto rounded-xl bg-[#7C3AED] px-20 hover:bg-[#6D28D9]"
          disabled={isPending}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  )
}
