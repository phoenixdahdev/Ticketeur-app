ALTER TABLE "orders" ADD COLUMN "subtotal_minor" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fee_minor" integer DEFAULT 0 NOT NULL;