import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1768574635563 implements MigrationInterface {
    name = 'UpdateDataBase1768574635563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" ADD "becoin_orange" numeric(14,2) DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "becoin_orange"`);
    }

}
