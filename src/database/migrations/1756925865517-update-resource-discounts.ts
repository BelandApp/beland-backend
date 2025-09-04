import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateResourceDiscounts1756925865517 implements MigrationInterface {
    name = 'UpdateResourceDiscounts1756925865517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resources" ADD "aplicationDiscount" numeric(14,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resources" DROP COLUMN "aplicationDiscount"`);
    }

}
