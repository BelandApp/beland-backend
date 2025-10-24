import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1761314884902 implements MigrationInterface {
    name = 'UpdateDataBase1761314884902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" ADD "becoin_green" numeric(14,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "unit_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "total_weight_recycled" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "message" text`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "images_urls" character varying array`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD CONSTRAINT "FK_dac491c0781191b399239ef729a" FOREIGN KEY ("type_id") REFERENCES "event_pass_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP CONSTRAINT "FK_dac491c0781191b399239ef729a"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "images_urls"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "total_weight_recycled"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "unit_weight"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "becoin_green"`);
    }

}
