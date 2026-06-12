ALTER TABLE "events" ADD COLUMN "slug" text;--> statement-breakpoint
-- Backfill slugs for existing rows from the title, mirroring the runtime
-- generateUniqueEventSlug(): lowercase, non-alphanumerics -> hyphen, trimmed,
-- with -2/-3 suffixes only on duplicate titles (row_number guarantees
-- uniqueness so the UNIQUE constraint below can't fail).
UPDATE "events" AS e
SET "slug" = d.base || CASE WHEN d.rn = 1 THEN '' ELSE '-' || d.rn END
FROM (
  SELECT
    "id",
    COALESCE(NULLIF(trim(both '-' from regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g')), ''), 'event') AS base,
    row_number() OVER (
      PARTITION BY COALESCE(NULLIF(trim(both '-' from regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g')), ''), 'event')
      ORDER BY "created_at", "id"
    ) AS rn
  FROM "events"
) AS d
WHERE e."id" = d."id";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_slug_unique" UNIQUE("slug");
