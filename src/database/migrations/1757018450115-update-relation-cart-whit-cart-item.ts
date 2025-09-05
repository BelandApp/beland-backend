import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationCartWhitCartItem1757018450115 implements MigrationInterface {
    name = 'UpdateRelationCartWhitCartItem1757018450115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`);
        await queryRunner.query(`CREATE TYPE "public"."user_feedback_section_enum" AS ENUM('DASHBOARD', 'WALLET', 'RECHARGE', 'WHITDRAW', 'RESOURCE', 'COMMUNITY', 'COMMERCE', 'FUNDATION', 'PURCHASE_BELAND', 'TRANSFER', 'PURCHASE')`);
        await queryRunner.query(`CREATE TABLE "user_feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "rating" integer NOT NULL, "comment" text, "section" "public"."user_feedback_section_enum", "platform" character varying(50), "app_version" character varying(50), "reviewed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_94fb2b9415a96bde222d5e40598" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "UQ_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_e4cc25c220dea064df29485e39a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_e4cc25c220dea064df29485e39a"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "UQ_6385a745d9e12a89b859bb25623" UNIQUE ("cart_id")`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "user_feedback"`);
        await queryRunner.query(`DROP TYPE "public"."user_feedback_section_enum"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
