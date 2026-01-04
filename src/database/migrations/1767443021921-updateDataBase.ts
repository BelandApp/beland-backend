import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1767443021921 implements MigrationInterface {
    name = 'UpdateDataBase1767443021921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "user_addresses" ADD "is_active" boolean DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_addresses" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "latitude" numeric(10,6)`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "longitude" numeric(10,6)`);
    }

}
