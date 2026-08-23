import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExperiencePurchases1788000000001 implements MigrationInterface {
  name = 'CreateExperiencePurchases1788000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "experience_purchases" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "payphone_transaction_id" character varying NOT NULL,
        "email" character varying,
        "total_amount" numeric(10,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'USD',
        "status" character varying NOT NULL DEFAULT 'COMPLETED',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_payphone_transaction_id" UNIQUE ("payphone_transaction_id"),
        CONSTRAINT "PK_experience_purchases" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "experience_purchase_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "purchase_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "unit_price" numeric(10,2) NOT NULL,
        "subtotal" numeric(10,2) NOT NULL,
        CONSTRAINT "PK_experience_purchase_items" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "experience_purchase_items" ADD CONSTRAINT "FK_experience_purchase_items_purchase" FOREIGN KEY ("purchase_id") REFERENCES "experience_purchases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "experience_purchase_items" ADD CONSTRAINT "FK_experience_purchase_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience_purchase_items" DROP CONSTRAINT "FK_experience_purchase_items_product"`,
    );
    await queryRunner.query(
      `ALTER TABLE "experience_purchase_items" DROP CONSTRAINT "FK_experience_purchase_items_purchase"`,
    );
    await queryRunner.query(`DROP TABLE "experience_purchase_items"`);
    await queryRunner.query(`DROP TABLE "experience_purchases"`);
  }
}
