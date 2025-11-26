import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1764185661065 implements MigrationInterface {
    name = 'UpdateDataBase1764185661065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "wallet_alias_idx" ON "wallets" ("alias") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."wallet_alias_idx"`);
    }

}
