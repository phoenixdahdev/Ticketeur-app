-- Better Auth 1.7 added a required `issuer` to the account model and keys
-- credential lookups on (providerId, issuer, accountId). Without this column
-- sign-in finds no credential account and fails with "Invalid email or
-- password", and sign-up cannot write the account row at all.
--
-- Added nullable first so the backfill can run: a bare `ADD COLUMN ... NOT
-- NULL` without a default fails on a non-empty table.
ALTER TABLE "account" ADD COLUMN "issuer" text;--> statement-breakpoint

-- Local password accounts — must equal better-auth's
-- createLocalAccountIssuer('credential').
UPDATE "account" SET "issuer" = 'local:credential'
  WHERE "issuer" IS NULL AND "provider_id" = 'credential';--> statement-breakpoint

-- Fallback for any non-credential rows, matching createOAuthAccountIssuer.
-- NOTE: a provider that advertises its own issuer (e.g. Google's
-- https://accounts.google.com) stores that instead; no such rows exist here.
UPDATE "account" SET "issuer" = 'local:oauth:' || "provider_id"
  WHERE "issuer" IS NULL;--> statement-breakpoint

ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_account_id_unique" ON "account" USING btree ("issuer","account_id");
