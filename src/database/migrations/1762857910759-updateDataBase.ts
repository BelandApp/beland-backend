import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1762857910759 implements MigrationInterface {
    name = 'UpdateDataBase1762857910759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "auth_verifications" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "auth_verifications" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_verifications" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "auth_verifications" ADD "phone" integer`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" numeric`);
    }

}
