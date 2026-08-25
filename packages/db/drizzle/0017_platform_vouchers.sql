-- Admin-owned ("platform") vouchers: organizer_id NULL means the code is not
-- tied to one organizer and can discount any event.
--
-- Safe on existing data: dropping NOT NULL never fails, and there are no
-- organizer_id NULL rows yet for the new partial index to conflict on.
ALTER TABLE "vouchers" ALTER COLUMN "organizer_id" DROP NOT NULL;--> statement-breakpoint

-- Platform codes must be unique among themselves. The existing
-- (organizer_id, lower(code)) index cannot enforce that, because a unique
-- index treats every NULL as distinct.
CREATE UNIQUE INDEX "vouchers_platform_code_unique" ON "vouchers" USING btree (lower("code")) WHERE "vouchers"."organizer_id" is null;
