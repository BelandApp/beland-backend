import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrarexperiencesfinal1787948615680 implements MigrationInterface {
    name = 'Migrarexperiencesfinal1787948615680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_media_type_enum" AS ENUM('image', 'video')`);
        await queryRunner.query(`CREATE TABLE "product_media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "url" text NOT NULL, "type" "public"."product_media_type_enum" NOT NULL DEFAULT 'image', "sortOrder" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_09d4639de8082a32aa27f3ac9a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience_purchase_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchase_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "subtotal" numeric(10,2) NOT NULL, CONSTRAINT "PK_ef5cdda57fca1ea1ac813cf4eab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience_purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payphone_transaction_id" character varying, "email" character varying NOT NULL, "phone" character varying NOT NULL, "total_amount" numeric(10,2) NOT NULL, "currency" character varying NOT NULL DEFAULT 'USD', "status" character varying NOT NULL DEFAULT 'COMPLETED', "is_reserved" boolean NOT NULL DEFAULT false, "payment_method" character varying NOT NULL DEFAULT 'PAYPHONE', "orange_reward_amount" integer NOT NULL DEFAULT '0', "orange_reward_credited" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4bc039df7932c2978d07aec8c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD "is_experience" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "products" ADD "creator_name" character varying(100) NOT NULL DEFAULT 'Beland'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "tags" text`);
        await queryRunner.query(`ALTER TABLE "products" ADD "likes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_name_enum" RENAME TO "users_role_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_name_enum" AS ENUM('USER', 'ADMIN', 'SUPERADMIN', 'COMMERCE')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" TYPE "public"."users_role_name_enum" USING "role_name"::"text"::"public"."users_role_name_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_name_enum_old"`);
        await queryRunner.query(`ALTER TABLE "product_media" ADD CONSTRAINT "FK_e6bb4a69096db4f6a1f5bada151" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" ADD CONSTRAINT "FK_f3b64729b6e455b746963614996" FOREIGN KEY ("purchase_id") REFERENCES "experience_purchases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" ADD CONSTRAINT "FK_32c79eedfa7b524ea8ad5393e98" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" DROP CONSTRAINT "FK_32c79eedfa7b524ea8ad5393e98"`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" DROP CONSTRAINT "FK_f3b64729b6e455b746963614996"`);
        await queryRunner.query(`ALTER TABLE "product_media" DROP CONSTRAINT "FK_e6bb4a69096db4f6a1f5bada151"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_name_enum_old" AS ENUM('USER', 'LEADER', 'ADMIN', 'SUPERADMIN', 'COMMERCE', 'FUNDATION')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" TYPE "public"."users_role_name_enum_old" USING "role_name"::"text"::"public"."users_role_name_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_name_enum_old" RENAME TO "users_role_name_enum"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "likes"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "creator_name"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_experience"`);
        await queryRunner.query(`DROP TABLE "experience_purchases"`);
        await queryRunner.query(`DROP TABLE "experience_purchase_items"`);
        await queryRunner.query(`DROP TABLE "product_media"`);
        await queryRunner.query(`DROP TYPE "public"."product_media_type_enum"`);
    }

}
