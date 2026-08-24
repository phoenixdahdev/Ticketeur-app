/**
 * One-off notice for accounts left without a credential row by the
 * better-auth 1.7 `issuer` regression (see migration 0016_account_issuer).
 *
 * Those users have a `user` row but no `account` row, so they can neither
 * sign in nor be looked up by password. Better Auth's reset-password flow
 * creates the missing credential account on the fly, so the fix for them is
 * simply to run through "Forgot password" — which is what this email asks.
 *
 * Run from the monorepo root. `tsx` lives in the admin workspace, and the
 * --tsconfig flag is required: without it tsx picks up the Next.js config
 * (jsx: "preserve") and the email templates fail with "React is not defined".
 *
 *   R="pnpm --filter=admin exec tsx --tsconfig $PWD/packages/email/tsconfig.json \
 *      $PWD/packages/jobs/scripts/send-account-setup-notice.ts"
 *
 *   $R                              # 1. dry run — list recipients, send nothing
 *   $R --to you@example.com         # 2. one test copy to yourself
 *   $R --live                       # 3. send for real, to every affected account
 *
 * Requires RESEND_API_KEY and DATABASE_URL in the environment; both are in the
 * repo-root .env (`set -a && . ./.env; set +a`).
 */
import { render } from '@react-email/render'
import { Resend } from 'resend'
import { db, user as userTable, account as accountTable } from '@ticketur/db'
// Named import, not the default: under tsx's CJS interop the default export
// resolves to the module object rather than the component function.
import { AccountSetupRequiredEmail } from '@ticketur/email/emails/account-setup-required'

import { FROM_EMAIL } from '../src/constants'

const BRAND_URL = 'https://www.useticketeur.com'
const SET_PASSWORD_URL = `${BRAND_URL}/forgot-password`
const SUBJECT = 'Finish setting up your Ticketeur account'

const args = process.argv.slice(2)
const live = args.includes('--live')
const toIndex = args.indexOf('--to')
const testTo = toIndex !== -1 ? args[toIndex + 1] : undefined

// Affected = a user row with no account row. Done as a set difference in JS
// rather than a left-join so this script needs no drizzle-orm operators of its
// own (it is not a direct dependency of this package). The table is small.
async function affectedUsers() {
  const [users, accounts] = await Promise.all([
    db
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
      })
      .from(userTable)
      .orderBy(userTable.createdAt),
    db.select({ userId: accountTable.userId }).from(accountTable),
  ])
  const hasAccount = new Set(accounts.map((a) => a.userId))
  return users.filter((u) => !hasAccount.has(u.id))
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY
  const recipients = await affectedUsers()

  if (!live && !testTo) {
    console.log(
      `Dry run — ${recipients.length} affected account(s), nothing sent:`
    )
    for (const r of recipients) console.log(`  ${r.email}  (${r.name})`)
    console.log('\nPass --to <email> for a test, or --live to send for real.')
    return
  }

  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  const resend = new Resend(apiKey)

  // A test send borrows a real recipient's name so the preview matches what
  // they would actually receive.
  const targets = testTo
    ? [{ email: testTo, name: recipients[0]?.name ?? 'there' }]
    : recipients

  for (const r of targets) {
    const html = await render(
      AccountSetupRequiredEmail({
        name: r.name,
        setPasswordUrl: SET_PASSWORD_URL,
      })
    )
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: r.email,
      subject: SUBJECT,
      html,
    })
    if (error) console.error(`  FAILED ${r.email}:`, error.message)
    else console.log(`  sent -> ${r.email}  (id ${data?.id})`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
