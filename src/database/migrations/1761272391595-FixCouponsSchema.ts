import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCouponsSchema1761272391595 implements MigrationInterface {
    name = 'FixCouponsSchema1761272391595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon_usages" DROP CONSTRAINT "FK_coupon_usages_coupon_id"`);
        await queryRunner.query(`ALTER TABLE "coupon_usages" DROP CONSTRAINT "FK_coupon_usages_user_id"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP CONSTRAINT "FK_2326117d6ad81572d73c73fcb17"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP CONSTRAINT "FK_dac491c0781191b399239ef729a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_coupon_usage_coupon_user"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "is_redeemed"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "redeemed_at"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "redeemed_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "unit_weight"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "images_urls"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "max_discount_cap" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "min_spend_required" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "max_usage_count" integer`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "usage_limit_per_user" integer`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "created_by_user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coupons" ALTER COLUMN "code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."coupons_type_enum" AS ENUM('PERCENTAGE', 'FIXED', 'BONUS_COINS', 'CIRCULARES')`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "type" "public"."coupons_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coupons" ALTER COLUMN "value" TYPE numeric(10,2)`);
        await queryRunner.query(`CREATE INDEX "IDX_1fa2cbd0178e94678cd55e376b" ON "coupon_usages" ("coupon_id", "user_id") `);
        await queryRunner.query(`ALTER TABLE "coupon_usages" ADD CONSTRAINT "FK_56491a0d0010feb079b964e23b4" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupon_usages" ADD CONSTRAINT "FK_579f1e1f0ccf35785bbbdebeb85" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD CONSTRAINT "FK_480e08b67b8b8a04472d82958ea" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupons" DROP CONSTRAINT "FK_480e08b67b8b8a04472d82958ea"`);
        await queryRunner.query(`ALTER TABLE "coupon_usages" DROP CONSTRAINT "FK_579f1e1f0ccf35785bbbdebeb85"`);
        await queryRunner.query(`ALTER TABLE "coupon_usages" DROP CONSTRAINT "FK_56491a0d0010feb079b964e23b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fa2cbd0178e94678cd55e376b"`);
        await queryRunner.query(`ALTER TABLE "coupons" ALTER COLUMN "value" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."coupons_type_enum"`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "type" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coupons" ALTER COLUMN "code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "created_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "usage_limit_per_user"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "max_usage_count"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "min_spend_required"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "max_discount_cap"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "message" text`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "images_urls" character varying array`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "unit_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "redeemed_by_user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "redeemed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "is_redeemed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX "IDX_coupon_usage_coupon_user" ON "coupon_usages" ("coupon_id", "user_id") `);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD CONSTRAINT "FK_dac491c0781191b399239ef729a" FOREIGN KEY ("type_id") REFERENCES "event_pass_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD CONSTRAINT "FK_2326117d6ad81572d73c73fcb17" FOREIGN KEY ("redeemed_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupon_usages" ADD CONSTRAINT "FK_coupon_usages_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "coupon_usages" ADD CONSTRAINT "FK_coupon_usages_coupon_id" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
