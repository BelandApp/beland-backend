import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBaseMigration1774537838516 implements MigrationInterface {
    name = 'UpdateDataBaseMigration1774537838516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."users_role_name_enum" RENAME TO "users_role_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_name_enum" AS ENUM('USER', 'ADMIN', 'SUPERADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" TYPE "public"."users_role_name_enum" USING "role_name"::"text"::"public"."users_role_name_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_name_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_name_enum_old" AS ENUM('USER', 'LEADER', 'ADMIN', 'SUPERADMIN', 'COMMERCE', 'FUNDATION')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" TYPE "public"."users_role_name_enum_old" USING "role_name"::"text"::"public"."users_role_name_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_name" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_name_enum_old" RENAME TO "users_role_name_enum"`);
    }

}
