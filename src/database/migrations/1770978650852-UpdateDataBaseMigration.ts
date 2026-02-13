import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseMigration1770978650852 implements MigrationInterface {
    name = 'UpdateDataBaseMigration1770978650852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_accounts" ADD "email" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ADD "ruc" character varying`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ADD CONSTRAINT "UQ_0daf2413dcb9f4490344c495f35" UNIQUE ("ruc")`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ADD "nro_account" character varying`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ADD CONSTRAINT "UQ_3ddfdc3131c8c0a40f9478754d8" UNIQUE ("nro_account")`);
        await queryRunner.query(`CREATE TYPE "public"."type_account_enum" AS ENUM('AHORRO', 'CORRIENTE')`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ADD "type_account" "public"."type_account_enum"`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ALTER COLUMN "bank" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ALTER COLUMN "cbu" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ALTER COLUMN "alias" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ALTER COLUMN "ticket_image_url" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ALTER COLUMN "ticket_image_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ALTER COLUMN "alias" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ALTER COLUMN "cbu" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ALTER COLUMN "bank" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" DROP COLUMN "type_account"`);
        await queryRunner.query(`DROP TYPE "public"."type_account_enum"`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" DROP CONSTRAINT "UQ_3ddfdc3131c8c0a40f9478754d8"`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" DROP COLUMN "nro_account"`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" DROP CONSTRAINT "UQ_0daf2413dcb9f4490344c495f35"`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" DROP COLUMN "ruc"`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" DROP COLUMN "email"`);
    }

}
