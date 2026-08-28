import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationFeed1787058963740 implements MigrationInterface {
    name = 'MigrationFeed1787058963740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_media_type_enum" AS ENUM('image', 'video')`);
        await queryRunner.query(`CREATE TABLE "product_media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "url" text NOT NULL, "type" "public"."product_media_type_enum" NOT NULL DEFAULT 'image', "sortOrder" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_09d4639de8082a32aa27f3ac9a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "product_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_d7defc4a0784b61e74902eede56" UNIQUE ("user_id", "product_id"), CONSTRAINT "PK_bfb69312fe591860533c8ed881b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_media" ADD CONSTRAINT "FK_e6bb4a69096db4f6a1f5bada151" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_likes" ADD CONSTRAINT "FK_4e72406feff8da9492589672947" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_likes" ADD CONSTRAINT "FK_7add69eb9dff06d1b36ce5fccdf" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_likes" DROP CONSTRAINT "FK_7add69eb9dff06d1b36ce5fccdf"`);
        await queryRunner.query(`ALTER TABLE "product_likes" DROP CONSTRAINT "FK_4e72406feff8da9492589672947"`);
        await queryRunner.query(`ALTER TABLE "product_media" DROP CONSTRAINT "FK_e6bb4a69096db4f6a1f5bada151"`);
        await queryRunner.query(`DROP TABLE "product_likes"`);
        await queryRunner.query(`DROP TABLE "product_media"`);
        await queryRunner.query(`DROP TYPE "public"."product_media_type_enum"`);
    }

}
