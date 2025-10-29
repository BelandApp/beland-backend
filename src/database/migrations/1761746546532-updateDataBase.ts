import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1761746546532 implements MigrationInterface {
    name = 'UpdateDataBase1761746546532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP COLUMN "holder_phone"`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD "holder_phone" character varying(30)`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP COLUMN "holder_email"`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD "holder_email" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP COLUMN "holder_email"`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD "holder_email" character varying(30)`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP COLUMN "holder_phone"`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD "holder_phone" character varying(20)`);
    }

}
