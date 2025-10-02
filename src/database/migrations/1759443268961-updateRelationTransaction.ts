import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationTransaction1759443268961 implements MigrationInterface {
    name = 'UpdateRelationTransaction1759443268961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_0f0344d52d20cf6de49baebe978" FOREIGN KEY ("related_wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_0f0344d52d20cf6de49baebe978"`);
    }

}
