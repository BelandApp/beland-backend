import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseMigration1772107266243 implements MigrationInterface {
    name = 'UpdateDataBaseMigration1772107266243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "orders_order_number_seq" OWNED BY "orders"."order_number"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "order_number" SET DEFAULT nextval('"orders_order_number_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "order_number" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "orders_order_number_seq"`);
    }

}
