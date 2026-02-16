import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseMigration1771250368465 implements MigrationInterface {
    name = 'UpdateDataBaseMigration1771250368465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP CONSTRAINT "UQ_2da33f84ce2f4729e785f36cf86"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD CONSTRAINT "UQ_2da33f84ce2f4729e785f36cf86" UNIQUE ("transfer_id")`);
    }

}
