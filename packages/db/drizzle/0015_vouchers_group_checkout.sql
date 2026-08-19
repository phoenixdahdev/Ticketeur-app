CREATE TABLE "vouchers" (
	"id" text PRIMARY KEY NOT NULL,
	"organizer_id" text NOT NULL,
	"event_id" text,
	"code" text NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" integer NOT NULL,
	"max_redemptions" integer,
	"redeemed_count" integer DEFAULT 0 NOT NULL,
	"valid_from" timestamp,
	"valid_until" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount_minor" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "voucher_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "attendees" jsonb;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "recipient_name" text;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "recipient_email" text;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_organizer_id_user_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "vouchers_organizer_code_unique" ON "vouchers" USING btree ("organizer_id",lower("code"));--> statement-breakpoint
CREATE INDEX "vouchers_organizer_idx" ON "vouchers" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX "vouchers_event_idx" ON "vouchers" USING btree ("event_id");