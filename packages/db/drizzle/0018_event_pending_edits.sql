ALTER TABLE "events" ADD COLUMN "pending_changes" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "pending_submitted_at" timestamp;