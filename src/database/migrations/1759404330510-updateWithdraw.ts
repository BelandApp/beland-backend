import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWithdraw1759404330510 implements MigrationInterface {
    name = 'UpdateWithdraw1759404330510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" ADD "is_active" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_withdraws" ADD "transaction_banck_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_withdraws" DROP COLUMN "transaction_banck_id"`);
        await queryRunner.query(`ALTER TABLE "withdraw_accounts" DROP COLUMN "is_active"`);
    }

}
