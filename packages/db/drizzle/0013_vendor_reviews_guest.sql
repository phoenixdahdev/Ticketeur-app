ALTER TABLE "vendor_reviews" ALTER COLUMN "reviewer_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_reviews" ADD COLUMN "guest_name" text;--> statement-breakpoint
ALTER TABLE "vendor_reviews" ADD COLUMN "guest_email" text;--> statement-breakpoint
CREATE UNIQUE INDEX "vendor_reviews_vendor_guest_email_unique" ON "vendor_reviews" USING btree ("vendor_id","guest_email") WHERE "vendor_reviews"."reviewer_id" is null;