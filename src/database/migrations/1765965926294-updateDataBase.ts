import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1765965926294 implements MigrationInterface {
    name = 'UpdateDataBase1765965926294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "owner_name"`);
        await queryRunner.query(`CREATE TYPE "public"."withdraw_accounts_country_enum" AS ENUM('ARGENTINA', 'COLOMBIA', 'ECUADOR')`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "country" "public"."withdraw_accounts_country_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."withdraw_accounts_currency_enum" AS ENUM('ARS', 'USD', 'COP')`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "currency" "public"."withdraw_accounts_currency_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "bankCode" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "bankName" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "accountNumber" character varying(34)`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "holderName" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "holderDocument" character varying(30) NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."withdraw_accounts_holderdocumenttype_enum" AS ENUM('DNI', 'CUIT', 'CUIL', 'CEDULA', 'RUC', 'NIT')`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "holderDocumentType" "public"."withdraw_accounts_holderdocumenttype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "cbu"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "cbu" character varying(22)`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "alias"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "alias" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "alias"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "alias" character varying`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "cbu"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "cbu" character varying`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "holderDocumentType"`);
        await queryRunner.query(`DROP TYPE "public"."withdraw_accounts_holderdocumenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "holderDocument"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "holderName"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "accountNumber"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "bankName"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "bankCode"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "currency"`);
        await queryRunner.query(`DROP TYPE "public"."withdraw_accounts_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "country"`);
        await queryRunner.query(`DROP TYPE "public"."withdraw_accounts_country_enum"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "owner_name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "provider" character varying`);
    }

}
