import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseNew1769078294504 implements MigrationInterface {
    name = 'UpdateDataBaseNew1769078294504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "UQ_dba960dbfd8636893d3c7acb18d"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "bankCode"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD "ticket_image_url" character varying`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "UQ_2b778f523f8d8d3744f5e01df41" UNIQUE ("cart_id", "product_id", "user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "UQ_2b778f523f8d8d3744f5e01df41"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP COLUMN "ticket_image_url"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "bankCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "UQ_dba960dbfd8636893d3c7acb18d" UNIQUE ("cart_id", "product_id")`);
    }

}
