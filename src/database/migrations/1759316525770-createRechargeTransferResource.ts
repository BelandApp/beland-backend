import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRechargeTransferResource1759316525770 implements MigrationInterface {
    name = 'CreateRechargeTransferResource1759316525770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "accountHolder" character varying(150) NOT NULL, "cbu" character varying(22) NOT NULL, "alias" character varying(50) NOT NULL, "bank" character varying(50), "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_075123462fd59ec69a617f15145" UNIQUE ("cbu"), CONSTRAINT "UQ_4fc0a94e38ef33c481a6e929fc5" UNIQUE ("alias"), CONSTRAINT "PK_30d855e954ca88f8d6badbab40e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transfer_resources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payment_account_id" uuid NOT NULL, "amount_usd" numeric(12,2) NOT NULL, "quantity" integer NOT NULL, "transfer_id" character varying(100) NOT NULL, "holder" character varying(100) NOT NULL, "user_id" uuid NOT NULL, "status_id" uuid NOT NULL, "resource_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5519eee0a56d1120badcfe514a8" UNIQUE ("transfer_id"), CONSTRAINT "PK_5e8ad8fcc1a2eadc4b36eda56f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recharge_transfers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payment_account_id" uuid NOT NULL, "amount_usd" numeric(12,2) NOT NULL, "transfer_id" character varying(100) NOT NULL, "user_id" uuid NOT NULL, "status_id" uuid NOT NULL, "transaction_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2da33f84ce2f4729e785f36cf86" UNIQUE ("transfer_id"), CONSTRAINT "PK_ded72bfae61802551464596a632" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_resources" DROP COLUMN "quantity_redeemed"`);
        await queryRunner.query(`ALTER TABLE "user_resources" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "user_resources" DROP CONSTRAINT "UQ_bd2dda118573d2fbb2c8c84084d"`);
        await queryRunner.query(`ALTER TABLE "user_resources" DROP COLUMN "hash_id"`);
        await queryRunner.query(`ALTER TABLE "user_resources" DROP COLUMN "qr_code"`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" ADD CONSTRAINT "FK_8408c071e78e2b379efb4a06319" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_resources" ADD CONSTRAINT "FK_d4a594b76e6efdf18645079ce22" FOREIGN KEY ("payment_account_id") REFERENCES "payment_accounts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_resources" ADD CONSTRAINT "FK_c41d846984244e60ab30b4db3e0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_resources" ADD CONSTRAINT "FK_6265ce77626950eb05c5089e99e" FOREIGN KEY ("status_id") REFERENCES "transaction_states"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_resources" ADD CONSTRAINT "FK_9b9c508f7a1d9749eec57421871" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD CONSTRAINT "FK_d56a6dbdf83de1fd911789c8281" FOREIGN KEY ("payment_account_id") REFERENCES "payment_accounts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD CONSTRAINT "FK_83f41b4d01b21b00bb6c0bcc73f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD CONSTRAINT "FK_ef2e804ba6d4b5556bd607af0e9" FOREIGN KEY ("status_id") REFERENCES "transaction_states"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" ADD CONSTRAINT "FK_8e423c17c095666d4ffb32dc78f" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP CONSTRAINT "FK_8e423c17c095666d4ffb32dc78f"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP CONSTRAINT "FK_ef2e804ba6d4b5556bd607af0e9"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP CONSTRAINT "FK_83f41b4d01b21b00bb6c0bcc73f"`);
        await queryRunner.query(`ALTER TABLE "recharge_transfers" DROP CONSTRAINT "FK_d56a6dbdf83de1fd911789c8281"`);
        await queryRunner.query(`ALTER TABLE "transfer_resources" DROP CONSTRAINT "FK_9b9c508f7a1d9749eec57421871"`);
        await queryRunner.query(`ALTER TABLE "transfer_resources" DROP CONSTRAINT "FK_6265ce77626950eb05c5089e99e"`);
        await queryRunner.query(`ALTER TABLE "transfer_resources" DROP CONSTRAINT "FK_c41d846984244e60ab30b4db3e0"`);
        await queryRunner.query(`ALTER TABLE "transfer_resources" DROP CONSTRAINT "FK_d4a594b76e6efdf18645079ce22"`);
        await queryRunner.query(`ALTER TABLE "payment_accounts" DROP CONSTRAINT "FK_8408c071e78e2b379efb4a06319"`);
        await queryRunner.query(`ALTER TABLE "user_resources" ADD "qr_code" text`);
        await queryRunner.query(`ALTER TABLE "user_resources" ADD "hash_id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_resources" ADD CONSTRAINT "UQ_bd2dda118573d2fbb2c8c84084d" UNIQUE ("hash_id")`);
        await queryRunner.query(`ALTER TABLE "user_resources" ADD "expires_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user_resources" ADD "quantity_redeemed" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "recharge_transfers"`);
        await queryRunner.query(`DROP TABLE "transfer_resources"`);
        await queryRunner.query(`DROP TABLE "payment_accounts"`);
    }

}
