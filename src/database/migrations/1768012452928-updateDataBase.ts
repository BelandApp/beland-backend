import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1768012452928 implements MigrationInterface {
    name = 'UpdateDataBase1768012452928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ADD "image_url" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "image_url"`);
    }

}
