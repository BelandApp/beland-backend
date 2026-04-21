import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStripeTopups1777000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "stripe_topups" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "wallet_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "client_transaction_id" uuid NOT NULL,
        "payment_intent_id" text,
        "stripe_event_id" text,
        "amount_usd" numeric(14,2) NOT NULL,
        "currency" text NOT NULL DEFAULT 'usd',
        "status" text NOT NULL DEFAULT 'PENDING',
        "becoins_granted" numeric(14,2),
        "failure_code" text,
        "failure_message" text,
        "stripe_signature" text,
        "raw_webhook_payload" text,
        "completed_at" TIMESTAMPTZ,
        "failed_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_stripe_topups_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_stripe_topups_wallet_id" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_stripe_topups_client_transaction_id_unique"
      ON "stripe_topups" ("client_transaction_id");
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_stripe_topups_payment_intent_id_unique"
      ON "stripe_topups" ("payment_intent_id")
      WHERE "payment_intent_id" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_stripe_topups_event_id_unique"
      ON "stripe_topups" ("stripe_event_id")
      WHERE "stripe_event_id" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_stripe_topups_wallet_status_created_at"
      ON "stripe_topups" ("wallet_id", "status", "created_at" DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_stripe_topups_wallet_status_created_at";
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_stripe_topups_event_id_unique";
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_stripe_topups_payment_intent_id_unique";
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_stripe_topups_client_transaction_id_unique";
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS "stripe_topups";
    `);
  }
}
