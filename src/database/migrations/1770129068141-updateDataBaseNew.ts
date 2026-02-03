import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseNew1770129068141 implements MigrationInterface {
    name = 'UpdateDataBaseNew1770129068141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "quantity" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity"`);
    }

}
