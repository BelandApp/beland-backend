import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseasd1761746996638 implements MigrationInterface {
    name = 'UpdateDataBaseasd1761746996638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "address" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "latitude" numeric(14,6)`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "longitude" numeric(14,6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "address"`);
    }

}
