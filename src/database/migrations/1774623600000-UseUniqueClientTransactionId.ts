import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseUniqueClientTransactionId1774623600000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "transactions" t
      WHERE t."clientTransactionId" IS NOT NULL
        AND t.ctid IN (
          SELECT duplicate.ctid
          FROM (
            SELECT ctid,
                   ROW_NUMBER() OVER (
                     PARTITION BY "clientTransactionId"
                     ORDER BY "created_at" ASC, "id" ASC
                   ) AS row_num
            FROM "transactions"
            WHERE "clientTransactionId" IS NOT NULL
          ) duplicate
          WHERE duplicate.row_num > 1
        );
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_transactions_payphone_transaction_id_unique";
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_transactions_client_transaction_id_unique"
      ON "transactions" ("clientTransactionId")
      WHERE "clientTransactionId" IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_transactions_client_transaction_id_unique";
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_transactions_payphone_transaction_id_unique"
      ON "transactions" ("payphone_transactionId")
      WHERE "payphone_transactionId" IS NOT NULL;
    `);
  }
}
