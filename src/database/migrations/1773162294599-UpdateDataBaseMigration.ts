import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseMigration1773162294599 implements MigrationInterface {
    name = 'UpdateDataBaseMigration1773162294599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP CONSTRAINT "FK_7f2b1b844405ac9bba63334035b"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP CONSTRAINT "FK_69d4cabd205e8c98c6f42d2edb9"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "recycled_weight"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "scanned_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "redeemed_at"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "is_redeemed"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD CONSTRAINT "FK_e8c1e4745910456f4cc09216083" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP CONSTRAINT "FK_e8c1e4745910456f4cc09216083"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "product_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "is_redeemed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "redeemed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "scanned_by_user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "recycled_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD CONSTRAINT "FK_69d4cabd205e8c98c6f42d2edb9" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD CONSTRAINT "FK_7f2b1b844405ac9bba63334035b" FOREIGN KEY ("scanned_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
