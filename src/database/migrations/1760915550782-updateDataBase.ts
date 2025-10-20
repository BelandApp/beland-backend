import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1760915550782 implements MigrationInterface {
    name = 'UpdateDataBase1760915550782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "background_url" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "event_place" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "event_city" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "start_sale_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "end_sale_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "is_user_favorite" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "is_user_favorite"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "end_sale_date"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "start_sale_date"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "event_city"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "event_place"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "background_url"`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "end_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "start_date" TIMESTAMP`);
    }

}
