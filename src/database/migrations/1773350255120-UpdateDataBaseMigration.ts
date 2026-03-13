import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseMigration1773350255120 implements MigrationInterface {
    name = 'UpdateDataBaseMigration1773350255120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP CONSTRAINT "FK_7f2b1b844405ac9bba63334035b"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP CONSTRAINT "FK_69d4cabd205e8c98c6f42d2edb9"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "recycled_weight"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "price_becoin"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "total_becoin"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "scanned_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "redeemed_at"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "is_redeemed"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "transaction_states" ADD "color" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "transaction_types" ADD "color" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "transaction_types" ADD "icon" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "price_dollar" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "total_dollar" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD CONSTRAINT "FK_e8c1e4745910456f4cc09216083" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP CONSTRAINT "FK_e8c1e4745910456f4cc09216083"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "total_dollar"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "price_dollar"`);
        await queryRunner.query(`ALTER TABLE "transaction_types" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "transaction_types" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "transaction_states" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "product_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "is_redeemed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "redeemed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD "scanned_by_user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "total_becoin" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "price_becoin" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "recycled_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD CONSTRAINT "FK_69d4cabd205e8c98c6f42d2edb9" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recycled_items" ADD CONSTRAINT "FK_7f2b1b844405ac9bba63334035b" FOREIGN KEY ("scanned_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
