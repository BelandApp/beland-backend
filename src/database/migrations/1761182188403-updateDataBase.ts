import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1761182188403 implements MigrationInterface {
    name = 'UpdateDataBase1761182188403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "unit_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "total_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "message" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "unit_weight"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "total_weight"`);
    }

}
