import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1763978782090 implements MigrationInterface {
    name = 'UpdateDataBase1763978782090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "topups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "wallet_id" uuid NOT NULL, "merchantTradeNo" text NOT NULL, "amount_usd" numeric(14,2) NOT NULL, "currency" text NOT NULL DEFAULT 'USDT', "prepayId" text, "checkoutUrl" text, "status" text NOT NULL DEFAULT 'PENDING', "raw_webhook_payload" text, "becoins_granted" numeric(14,2), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fbfc343134573ee4a34f9785208" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_topup_merchantTradeNo_unique" ON "topups" ("merchantTradeNo") `);
        await queryRunner.query(`ALTER TABLE "topups" ADD CONSTRAINT "FK_57e37f4ca655dcde7d6b9fb7e65" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topups" DROP CONSTRAINT "FK_57e37f4ca655dcde7d6b9fb7e65"`);
        await queryRunner.query(`DROP INDEX "public"."idx_topup_merchantTradeNo_unique"`);
        await queryRunner.query(`DROP TABLE "topups"`);
    }

}
