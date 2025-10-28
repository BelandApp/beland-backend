import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1761605118028 implements MigrationInterface {
    name = 'UpdateDataBase1761605118028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP COLUMN "holder_document"`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD "holder_instagram_tiktok" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD "holder_email" character varying(30)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP COLUMN "holder_email"`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP COLUMN "holder_instagram_tiktok"`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD "holder_document" character varying(30)`);
    }

}
