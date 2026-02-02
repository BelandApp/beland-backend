import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseNew1770022953493 implements MigrationInterface {
    name = 'UpdateDataBaseNew1770022953493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups-type" ADD "image_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups-type" DROP COLUMN "image_url"`);
    }

}
