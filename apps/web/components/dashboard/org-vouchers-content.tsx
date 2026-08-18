'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'
import {
  NativeSelect,
  NativeSelectOption,
} from '@ticketur/ui/components/native-select'

import { useTRPC } from '@/lib/trpc'

const ALL_EVENTS = '__all__'

type FormState = {
  code: string
  eventId: string
  discountType: 'percent' | 'fixed'
  value: string
  maxRedemptions: string
  validUntil: string
}

const EMPTY_FORM: FormState = {
  code: '',
  eventId: ALL_EVENTS,
  discountType: 'percent',
  value: '',
  maxRedemptions: '',
  validUntil: '',
}

// Stored value → human label. Percent is basis points (2000 → 20%); fixed is
// minor units (150000 → ₦1,500).
function discountLabel(type: 'percent' | 'fixed', value: number) {
  return type === 'percent'
    ? `${value / 100}%`
    : `₦${(value / 100).toLocaleString()}`
}

export function OrgVouchersContent() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const listQuery = useQuery(trpc.org.vouchers.list.queryOptions())
  const eventsQuery = useQuery(trpc.org.vouchers.eventOptions.queryOptions())

  function invalidateList() {
    void queryClient.invalidateQueries({
      queryKey: trpc.org.vouchers.list.queryKey(),
    })
  }

  const create = useMutation(
    trpc.org.vouchers.create.mutationOptions({
      onSuccess: () => {
        toast.success('Voucher created')
        setForm(EMPTY_FORM)
        invalidateList()
      },
      onError: (err) =>
        toast.error('Could not create voucher', { description: err.message }),
    })
  )

  const setActive = useMutation(
    trpc.org.vouchers.setActive.mutationOptions({
      onSuccess: () => invalidateList(),
      onError: (err) =>
        toast.error('Could not update voucher', { description: err.message }),
    })
  )

  function onCreate(e: React.FormEvent) {
    e.preventDefault()
    const code = form.code.trim()
    if (code.length < 2) return toast.error('Enter a voucher code.')
    const amount = Number(form.value)
    if (!Number.isFinite(amount) || amount <= 0)
      return toast.error('Enter a discount amount.')
    if (form.discountType === 'percent' && amount > 100)
      return toast.error('Percent discount must be 1–100.')

    // Percent → whole percent (server stores basis points). Fixed → Naira,
    // sent as minor units.
    const discountValue =
      form.discountType === 'percent' ? Math.round(amount) : Math.round(amount * 100)
    const maxRedemptions = form.maxRedemptions.trim()
      ? Math.round(Number(form.maxRedemptions))
      : null

    create.mutate({
      code,
      eventId: form.eventId === ALL_EVENTS ? null : form.eventId,
      discountType: form.discountType,
      discountValue,
      maxRedemptions:
        maxRedemptions && maxRedemptions > 0 ? maxRedemptions : null,
      validUntil: form.validUntil ? new Date(form.validUntil) : null,
    })
  }

  const vouchers = listQuery.data ?? []
  const events = eventsQuery.data ?? []

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
          Vouchers
        </h1>
        <p className="text-muted-foreground text-sm">
          Create discount codes for your events. Leave the event as{' '}
          <span className="font-medium">All events</span> to make a code that
          works across everything you run.
        </p>
      </header>

      {/* Create form */}
      <form
        onSubmit={onCreate}
        className="border-border bg-card grid grid-cols-1 gap-4 rounded-2xl border p-5 md:grid-cols-2 md:p-6"
      >
        <Field label="Code">
          <Input
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            placeholder="EARLY20"
            disabled={create.isPending}
          />
        </Field>

        <Field label="Applies to">
          <NativeSelect
            className="w-full"
            value={form.eventId}
            onChange={(e) => setForm({ ...form, eventId: e.target.value })}
            disabled={create.isPending}
          >
            <NativeSelectOption value={ALL_EVENTS}>
              All events
            </NativeSelectOption>
            {events.map((ev) => (
              <NativeSelectOption key={ev.id} value={ev.id}>
                {ev.title}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Discount type">
          <NativeSelect
            className="w-full"
            value={form.discountType}
            onChange={(e) =>
              setForm({
                ...form,
                discountType: e.target.value as 'percent' | 'fixed',
              })
            }
            disabled={create.isPending}
          >
            <NativeSelectOption value="percent">Percentage</NativeSelectOption>
            <NativeSelectOption value="fixed">Fixed amount</NativeSelectOption>
          </NativeSelect>
        </Field>

        <Field
          label={form.discountType === 'percent' ? 'Percent off' : 'Amount off (₦)'}
        >
          <Input
            type="number"
            inputMode="numeric"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder={form.discountType === 'percent' ? '20' : '1500'}
            disabled={create.isPending}
          />
        </Field>

        <Field label="Max redemptions (optional)">
          <Input
            type="number"
            inputMode="numeric"
            value={form.maxRedemptions}
            onChange={(e) =>
              setForm({ ...form, maxRedemptions: e.target.value })
            }
            placeholder="Unlimited"
            disabled={create.isPending}
          />
        </Field>

        <Field label="Valid until (optional)">
          <Input
            type="date"
            value={form.validUntil}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
            disabled={create.isPending}
          />
        </Field>

        <div className="md:col-span-2">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Creating…' : 'Create voucher'}
          </Button>
        </div>
      </form>

      {/* List */}
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-foreground text-lg font-semibold">
          Your vouchers
        </h2>
        {listQuery.isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-16 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : vouchers.length === 0 ? (
          <p className="text-muted-foreground border-border rounded-xl border border-dashed p-8 text-center text-sm">
            No vouchers yet. Create one above.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {vouchers.map((v) => (
              <li
                key={v.id}
                className="border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-foreground font-semibold">
                      {v.code}
                    </span>
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
                      {discountLabel(v.discountType, v.discountValue)}
                    </span>
                    {!v.active ? (
                      <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                        Inactive
                      </span>
                    ) : null}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {v.eventTitle ?? 'All events'} ·{' '}
                    {v.redeemedCount}
                    {v.maxRedemptions != null ? `/${v.maxRedemptions}` : ''} used
                    {v.validUntil
                      ? ` · until ${new Date(v.validUntil).toLocaleDateString()}`
                      : ''}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={setActive.isPending}
                  onClick={() =>
                    setActive.mutate({ id: v.id, active: !v.active })
                  }
                >
                  {v.active ? 'Deactivate' : 'Activate'}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-foreground text-sm font-semibold">{label}</label>
      {children}
    </div>
  )
}
