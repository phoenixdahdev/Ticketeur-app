CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"tier_id" text NOT NULL,
	"tier_name" text NOT NULL,
	"unit_price_minor" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "tier_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_tier_id_ticket_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."ticket_tiers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_tier_idx" ON "order_items" USING btree ("tier_id");--> statement-breakpoint
-- Backfill: give every existing (single-tier) order a matching line item so
-- the new order_items-based readers see legacy orders too. Snapshots the
-- tier's current name + price; legacy subtotals were price×qty so this is exact.
INSERT INTO "order_items" ("id", "order_id", "tier_id", "tier_name", "unit_price_minor", "quantity")
SELECT
	'oi_' || o."id",
	o."id",
	o."tier_id",
	tt."name",
	tt."price_minor",
	o."quantity"
FROM "orders" o
JOIN "ticket_tiers" tt ON tt."id" = o."tier_id"
WHERE o."tier_id" IS NOT NULL;