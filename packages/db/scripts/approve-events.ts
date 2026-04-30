import 'dotenv/config'
import { eq } from 'drizzle-orm'

import { db } from '../src/client'
import { events } from '../src/schema'

async function main() {
  const before = await db
    .select({
      id: events.id,
      title: events.title,
      status: events.status,
    })
    .from(events)

  console.log(`\n${before.length} event(s) found:`)
  for (const e of before) {
    console.log(`  • ${e.title.padEnd(40)}  ${e.status}  ${e.id}`)
  }

  const promotable = before.filter(
    (e) => e.status === 'in-review' || e.status === 'draft'
  )

  if (promotable.length === 0) {
    console.log('\nNothing to promote — all events already published or archived.')
    return
  }

  console.log(`\nPromoting ${promotable.length} → 'upcoming'…`)
  for (const e of promotable) {
    await db
      .update(events)
      .set({ status: 'upcoming', updatedAt: new Date() })
      .where(eq(events.id, e.id))
    console.log(`  ✓ ${e.title}`)
  }

  console.log('\nDone.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => process.exit(0))
