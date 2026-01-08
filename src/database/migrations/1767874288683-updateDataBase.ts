import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1767874288683 implements MigrationInterface {
    name = 'UpdateDataBase1767874288683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "total_weight_recycled"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "returned_paied" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "returned_split" boolean`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_becoin_returned" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "cancelled_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ADD "total_weight_recycled" numeric(10,3) DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total_weight_recycled"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cancelled_at"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_becoin_returned"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "returned_split"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "returned_paied"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "total_weight_recycled" numeric(7,3) DEFAULT '0'`);
    }

}
