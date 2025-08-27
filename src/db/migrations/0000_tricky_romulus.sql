CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"email" varchar(255) NOT NULL,
	"username" varchar(50),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"user_type" varchar(20) DEFAULT 'normal' NOT NULL,
	"password" varchar(255),
	"avatar" text,
	"registration_documents" jsonb,
	"valid_id" varchar(500),
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"google_id" varchar(255),
	"last_login_at" timestamp,
	"email_verified_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification_otps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_id" uuid NOT NULL,
	"otp" varchar(6) NOT NULL,
	"type" varchar(50) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "verification_otps" ADD CONSTRAINT "verification_otps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;