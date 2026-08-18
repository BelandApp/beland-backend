import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateWalletBecoinBalanceToUsd1785280000000 implements MigrationInterface {
    name = 'MigrateWalletBecoinBalanceToUsd1785280000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "wallets"
            SET "usd_balance" = ROUND((COALESCE("becoin_balance", 0) * 0.05)::numeric, 2)
            WHERE COALESCE("becoin_balance", 0) > 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "wallets"
            SET "usd_balance" = 0
            WHERE COALESCE("becoin_balance", 0) > 0
        `);
    }

}
