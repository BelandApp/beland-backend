import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseMigration1771944613679 implements MigrationInterface {
    name = 'UpdateDataBaseMigration1771944613679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" ADD "day_limit_cancelled" integer`);
        await queryRunner.query(`ALTER TABLE "services" ADD "porcent_cancelled" integer`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "orders_order_number_seq" OWNED BY "orders"."order_number"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "order_number" SET DEFAULT nextval('"orders_order_number_seq"')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "order_number" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "order_number" SET DEFAULT nextval('orders_order_number_seq1')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "order_number" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "orders_order_number_seq"`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "porcent_cancelled"`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "day_limit_cancelled"`);
    }

}
