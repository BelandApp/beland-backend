import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1766973371371 implements MigrationInterface {
    name = 'UpdateDataBase1766973371371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group_privacies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "is_visible" boolean NOT NULL DEFAULT true, "allow_free_join" boolean NOT NULL DEFAULT false, "require_approval" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_a808664bb78d436d85a80956b1c" UNIQUE ("code"), CONSTRAINT "PK_b35ef155e06e0b08e7834b5be4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "description" character varying(500), "cost" numeric(12,2), "price" numeric(12,2), "price_becoin" numeric(12,2), "image_url" character varying(500), "is_available" boolean NOT NULL DEFAULT true, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "message_invitation" text`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "privacy_id" uuid`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "event_pass_id" uuid`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "UQ_1a7ed9ddd5fadcfc8dc51fe4aba" UNIQUE ("event_pass_id")`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "group_privacy_id" uuid`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP CONSTRAINT "FK_2eb3fe9d3e60558f734ab098a42"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "currency" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "bankCode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "bankName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "withdraw_account_type_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "holderName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "holderDocument" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "holderDocumentType" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_74cace7dba4f1944f2afb3fb35c" FOREIGN KEY ("group_privacy_id") REFERENCES "group_privacies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_1a7ed9ddd5fadcfc8dc51fe4aba" FOREIGN KEY ("event_pass_id") REFERENCES "event_pass"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD CONSTRAINT "FK_2eb3fe9d3e60558f734ab098a42" FOREIGN KEY ("withdraw_account_type_id") REFERENCES "withdraw_account_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP CONSTRAINT "FK_2eb3fe9d3e60558f734ab098a42"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_1a7ed9ddd5fadcfc8dc51fe4aba"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_74cace7dba4f1944f2afb3fb35c"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "holderDocumentType" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "holderDocument" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "holderName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "withdraw_account_type_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "bankName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "bankCode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "currency" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD CONSTRAINT "FK_2eb3fe9d3e60558f734ab098a42" FOREIGN KEY ("withdraw_account_type_id") REFERENCES "withdraw_account_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "group_privacy_id"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "UQ_1a7ed9ddd5fadcfc8dc51fe4aba"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "event_pass_id"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "privacy_id"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "message_invitation"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "group_privacies"`);
    }

}
