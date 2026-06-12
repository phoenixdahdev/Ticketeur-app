import { eq } from 'drizzle-orm'

import type { Database } from '@ticketur/db'
import { events } from '@ticketur/db'

/**
 * Turn a title into a URL-safe slug: lowercased ASCII, hyphen-separated.
 * Diacritics are stripped and any run of non-alphanumerics collapses to a
 * single hyphen. Falls back to "event" when the title has no usable chars.
 */
export function slugify(input: string): string {
  const base = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
  return base.length > 0 ? base : 'event'
}

/**
 * Build a slug that isn't already taken, appending -2, -3, … on collision.
 * Event creation is low-frequency so the sequential probes are cheap; the
 * unique constraint on events.slug is the final backstop against races.
 */
export async function generateUniqueEventSlug(
  db: Database,
  title: string
): Promise<string> {
  const base = slugify(title)
  let candidate = base
  for (let n = 2; n < 1000; n++) {
    const existing = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.slug, candidate))
      .limit(1)
    if (existing.length === 0) return candidate
    candidate = `${base}-${n}`
  }
  // Pathological fallback — effectively unreachable.
  return `${base}-${Date.now()}`
}
