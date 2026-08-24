'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@ticketur/ui/components/button'
import { Textarea } from '@ticketur/ui/components/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ticketur/ui/components/dialog'
import {
  NativeSelect,
  NativeSelectOption,
} from '@ticketur/ui/components/native-select'

import { useTRPC } from '@/lib/trpc'

export type SendTarget = {
  id: string
  code: string
  /** Set when the voucher only works on one event. */
  eventId: string | null
}

type Audience = 'emails' | 'event-attendees'

export function SendVoucherDialog({
  target,
  onClose,
}: {
  target: SendTarget | null
  onClose: () => void
}) {
  const trpc = useTRPC()
  const [audience, setAudience] = useState<Audience>('emails')
  const [emailText, setEmailText] = useState('')
  const [note, setNote] = useState('')
  const [eventId, setEventId] = useState('')

  const eventsQuery = useQuery(trpc.org.vouchers.eventOptions.queryOptions())
  const events = eventsQuery.data ?? []

  // Reset per target, and pre-select the event when the code is scoped to one
  // (it can only be sent to that event's attendees anyway).
  useEffect(() => {
    if (!target) return
    setAudience('emails')
    setEmailText('')
    setNote('')
    setEventId(target.eventId ?? '')
  }, [target])

  const send = useMutation(
    trpc.org.vouchers.send.mutationOptions({
      onSuccess: (res) => {
        toast.success(
          `Voucher sent to ${res.recipients} ${res.recipients === 1 ? 'person' : 'people'}`
        )
        onClose()
      },
      onError: (err) =>
        toast.error('Could not send voucher', { description: err.message }),
    })
  )

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!target) return

    if (audience === 'emails') {
      // Accept commas, semicolons, whitespace or newlines between addresses —
      // people paste from all sorts of places.
      const emails = [
        ...new Set(
          emailText
            .split(/[\s,;]+/)
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean)
        ),
      ]
      if (emails.length === 0) return toast.error('Add at least one email.')
      const invalid = emails.filter(
        (e) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)
      )
      if (invalid.length > 0) {
        return toast.error('Check these addresses', {
          description: invalid.slice(0, 3).join(', '),
        })
      }
      send.mutate({
        id: target.id,
        recipients: { kind: 'emails', emails },
        note: note.trim() || undefined,
      })
      return
    }

    if (!eventId) return toast.error('Pick an event.')
    send.mutate({
      id: target.id,
      recipients: { kind: 'event-attendees', eventId },
      note: note.trim() || undefined,
    })
  }

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Email code {target?.code}</DialogTitle>
            <DialogDescription>
              Recipients get the code with a link to book. Each email is sent
              individually, so nobody sees anyone else&apos;s address.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label className="text-foreground text-sm font-semibold">
              Send to
            </label>
            <NativeSelect
              className="w-full"
              value={audience}
              onChange={(e) => setAudience(e.target.value as Audience)}
              disabled={send.isPending}
            >
              <NativeSelectOption value="emails">
                A list of email addresses
              </NativeSelectOption>
              <NativeSelectOption value="event-attendees">
                Everyone with a ticket for an event
              </NativeSelectOption>
            </NativeSelect>
          </div>

          {audience === 'emails' ? (
            <div className="flex flex-col gap-2">
              <label className="text-foreground text-sm font-semibold">
                Email addresses
              </label>
              <Textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder={'ada@example.com\nchidi@example.com'}
                rows={4}
                disabled={send.isPending}
              />
              <p className="text-muted-foreground text-xs">
                Separate with commas, spaces or new lines. Up to 200 per send.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-foreground text-sm font-semibold">
                Event
              </label>
              <NativeSelect
                className="w-full"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                disabled={send.isPending || target?.eventId !== null}
              >
                <NativeSelectOption value="">Pick an event…</NativeSelectOption>
                {events.map((ev) => (
                  <NativeSelectOption key={ev.id} value={ev.id}>
                    {ev.title}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {target?.eventId !== null ? (
                <p className="text-muted-foreground text-xs">
                  This code only works on one event, so it can only go to that
                  event&apos;s ticket holders.
                </p>
              ) : null}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-foreground text-sm font-semibold">
              Note (optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thanks for coming to our last show — here's something for the next one."
              rows={2}
              maxLength={500}
              disabled={send.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={send.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={send.isPending}>
              {send.isPending ? 'Sending…' : 'Send code'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
