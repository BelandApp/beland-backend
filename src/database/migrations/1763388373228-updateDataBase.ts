import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1763388373228 implements MigrationInterface {
    name = 'UpdateDataBase1763388373228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "recycled_weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "recycled_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "collected_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "recycled_code" character varying(8)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "recycled_code"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "collected_at"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "recycled_at"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "recycled_weight"`);
    }

}
