import { MigrationInterface, QueryRunner } from "typeorm";

export class BackendFreez1784630908378 implements MigrationInterface {
    name = 'BackendFreez1784630908378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "is_circular" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "amount_orange" numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "post_orange_balance" numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "amount_green" numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "post_green_balance" numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "user_gift_cards" ADD "reserved_balance" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "gift_card_amount_used" numeric(14,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "user_gift_card_id" uuid`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD "refunded_amount" numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "stripe_topups" ADD "user_gift_card_id" uuid`);
        await queryRunner.query(`ALTER TABLE "stripe_topups" ADD "gift_card_reserved_amount" numeric(14,2)`);
        await queryRunner.query(`ALTER TYPE "public"."transactions_external_provider_enum" RENAME TO "transactions_external_provider_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_external_provider_enum" AS ENUM('STRIPE', 'PAYPHONE', 'TRANSFER', 'WALLET', 'GIFTCARD')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "external_provider" TYPE "public"."transactions_external_provider_enum" USING "external_provider"::"text"::"public"."transactions_external_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_external_provider_enum_old"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP CONSTRAINT "FK_8e423c17c095666d4ffb32dc78f"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ALTER COLUMN "transaction_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_ca34658d91c9afba3d13f402ca4" FOREIGN KEY ("user_gift_card_id") REFERENCES "user_gift_cards"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD CONSTRAINT "FK_8e423c17c095666d4ffb32dc78f" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP CONSTRAINT "FK_8e423c17c095666d4ffb32dc78f"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_ca34658d91c9afba3d13f402ca4"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ALTER COLUMN "transaction_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD CONSTRAINT "FK_8e423c17c095666d4ffb32dc78f" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_external_provider_enum_old" AS ENUM('STRIPE', 'PAYPHONE', 'TRANSFER')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "external_provider" TYPE "public"."transactions_external_provider_enum_old" USING "external_provider"::"text"::"public"."transactions_external_provider_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_external_provider_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transactions_external_provider_enum_old" RENAME TO "transactions_external_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "stripe_topups" DROP COLUMN "gift_card_reserved_amount"`);
        await queryRunner.query(`ALTER TABLE "stripe_topups" DROP COLUMN "user_gift_card_id"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP COLUMN "refunded_amount"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "user_gift_card_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "gift_card_amount_used"`);
        await queryRunner.query(`ALTER TABLE "user_gift_cards" DROP COLUMN "reserved_balance"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "post_green_balance"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount_green"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "post_orange_balance"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount_orange"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_circular"`);
    }

}
