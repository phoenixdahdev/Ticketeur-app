ALTER TABLE "user" ADD COLUMN "vendor_tagline" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_location" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_banner_url" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_instagram_url" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_website_url" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_expertise" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_focus" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_experience" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_showcase_images" jsonb DEFAULT '[]'::jsonb NOT NULL;