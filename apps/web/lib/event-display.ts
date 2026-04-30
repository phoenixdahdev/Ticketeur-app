export function initialsFromTitle(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '??'
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase()
  return (words[0]![0]! + words[1]![0]!).toUpperCase()
}

export function formatEventDate(iso: string): string {
  // iso is YYYY-MM-DD; render as "Oct 24, 2024"
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function formatWeekday(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { weekday: 'long' })
}

export function eventCode(id: string): string {
  // Stable display code; truncate UUID for readability
  return `EVT-${id.replace(/^evt_/, '').slice(0, 8).toUpperCase()}`
}

export function formatNaira(minor: number): string {
  return `₦${(minor / 100).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`
}
