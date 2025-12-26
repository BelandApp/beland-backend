import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1766746168891 implements MigrationInterface {
    name = 'UpdateDataBase1766746168891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_item_consumptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_item_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_863c966d9cd22632d9f989fa2be" UNIQUE ("order_item_id", "user_id"), CONSTRAINT "PK_13c2fc12404cf8af439abae4df1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "total_due" numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "outstanding_amount" numeric(14,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "is_fully_paid" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "amount_paid" TYPE numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "amount_paid" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "UQ_dba960dbfd8636893d3c7acb18d" UNIQUE ("cart_id", "product_id")`);
        await queryRunner.query(`ALTER TABLE "order_item_consumptions" ADD CONSTRAINT "FK_a5bf789bcdb1ecb237d19713920" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_consumptions" ADD CONSTRAINT "FK_7401a78135d1940a74fc58c52a8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_consumptions" DROP CONSTRAINT "FK_7401a78135d1940a74fc58c52a8"`);
        await queryRunner.query(`ALTER TABLE "order_item_consumptions" DROP CONSTRAINT "FK_a5bf789bcdb1ecb237d19713920"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "UQ_dba960dbfd8636893d3c7acb18d"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "amount_paid" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "amount_paid" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "is_fully_paid"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "outstanding_amount"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "total_due"`);
        await queryRunner.query(`DROP TABLE "order_item_consumptions"`);
    }

}
