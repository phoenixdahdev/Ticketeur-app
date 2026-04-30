// Lightweight skeleton that mirrors the real event detail layout: hero,
// info card with date/location, tab strip, content placeholder, similar
// events grid. Pure CSS — no client deps.

export function EventDetailSkeleton() {
  return (
    <>
      {/* Hero */}
      <section className="w-full px-5 pt-4 md:px-10 md:pt-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 md:gap-6">
          <div className="bg-muted size-11 animate-pulse rounded-full" />
          <div className="relative w-full">
            <div className="bg-muted aspect-[1360/360] w-full animate-pulse rounded-[20px] md:aspect-[1360/320]" />
            <div className="border-border bg-card mx-4 -mt-16 flex flex-col gap-5 rounded-2xl border p-5 shadow-lg md:mx-8 md:-mt-20 md:flex-row md:items-center md:gap-6 md:p-6">
              <div className="bg-muted size-[96px] shrink-0 animate-pulse rounded-xl md:size-[120px]" />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="bg-muted h-7 w-3/4 animate-pulse rounded-md md:h-9 md:w-2/3" />
                <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                <div className="flex flex-wrap gap-3">
                  <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-28 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-36 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab strip + content */}
      <section className="w-full px-5 md:px-10">
        <div className="mx-auto max-w-[1440px] pt-10 pb-6 md:pt-16 md:pb-10">
          <div className="border-b border-[#c6c6c6] flex gap-6 md:gap-8 pb-4">
            <div className="bg-muted h-5 w-16 animate-pulse rounded" />
            <div className="bg-muted h-5 w-16 animate-pulse rounded" />
            <div className="bg-muted h-5 w-16 animate-pulse rounded" />
          </div>

          <div className="pt-8 md:pt-10 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="bg-muted h-7 w-48 animate-pulse rounded-md" />
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-11/12 animate-pulse rounded" />
              <div className="bg-muted h-4 w-9/12 animate-pulse rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted h-24 animate-pulse rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Similar events */}
      <section className="w-full px-5 md:px-10">
        <div className="mx-auto max-w-[1440px] py-10 md:py-16">
          <div className="bg-muted mb-6 h-7 w-44 animate-pulse rounded-md" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-72 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
