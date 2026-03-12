import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseMigration1773330463535 implements MigrationInterface {
    name = 'UpdateDataBaseMigration1773330463535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "price_becoin"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "total_becoin"`);
        await queryRunner.query(`ALTER TABLE "transaction_states" ADD "color" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "transaction_types" ADD "color" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "transaction_types" ADD "icon" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "price_dollar" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "total_dollar" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "total_dollar"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "price_dollar"`);
        await queryRunner.query(`ALTER TABLE "transaction_types" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "transaction_types" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "transaction_states" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "total_becoin" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "price_becoin" numeric(10,2) NOT NULL`);
    }

}
