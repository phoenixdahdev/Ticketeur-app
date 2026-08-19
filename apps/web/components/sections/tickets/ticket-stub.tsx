import { cn } from '@ticketur/ui/lib/utils'

// A single ticket "stub" with its QR — shared by the full order view
// (/tickets/[orderId]) and the per-recipient view (/tickets/code/[code]).

export function shortCode(code: string): string {
  return code.slice(0, 4).toUpperCase() + ' ' + code.slice(4, 8).toUpperCase()
}

export function TicketStub({
  index,
  total,
  code,
  qrDataUrl,
  tierName,
  holderName,
  eventTitle,
  eventDate,
  eventTime,
}: {
  index: number
  total: number
  code: string
  qrDataUrl: string
  tierName: string
  holderName: string
  eventTitle: string
  eventDate: string
  eventTime: string
}) {
  return (
    <article className="border-border bg-card relative isolate flex flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              {tierName}
            </span>
            <span className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
              {eventTitle}
            </span>
          </div>
          <span className="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
            {index + 1} / {total}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Definition label="Holder" value={holderName} />
          <Definition label="Date" value={eventDate} />
          <Definition label="Time" value={eventTime} />
        </div>

        <div className="border-border/60 flex flex-col gap-1 border-t pt-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Ticket code
            </span>
            <span className="text-foreground font-mono text-sm font-bold tracking-widest">
              {shortCode(code)}
            </span>
          </div>
          <p className="text-muted-foreground text-xs md:text-right">
            Single-entry · scan at gate
          </p>
        </div>
      </div>

      {/* perforation */}
      <div
        aria-hidden
        className="border-border/60 relative hidden w-px md:block"
      >
        <div className="bg-background absolute -top-2 -left-2 size-4 rounded-full border" />
        <div className="bg-background absolute -bottom-2 -left-2 size-4 rounded-full border" />
      </div>
      <div
        aria-hidden
        className="border-border/60 relative h-px w-full border-t border-dashed md:hidden"
      >
        <div className="bg-background absolute -top-2 -left-2 size-4 rounded-full border" />
        <div className="bg-background absolute -top-2 -right-2 size-4 rounded-full border" />
      </div>

      {/* QR side */}
      <div className="bg-background flex flex-col items-center justify-center gap-2 px-6 py-5 md:w-56 md:py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`Ticket ${index + 1} QR code`}
          className="size-40 md:size-44"
        />
        <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          Scan to verify
        </p>
      </div>
    </article>
  )
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground truncate text-sm font-semibold">
        {value}
      </span>
    </div>
  )
}
