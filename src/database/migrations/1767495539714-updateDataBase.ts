import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1767495539714 implements MigrationInterface {
    name = 'UpdateDataBase1767495539714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_74cace7dba4f1944f2afb3fb35c"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "group_privacy_id"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_0f20464114fe9fd73a31d3e6132" FOREIGN KEY ("privacy_id") REFERENCES "group_privacies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_0f20464114fe9fd73a31d3e6132"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "group_privacy_id" uuid`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_74cace7dba4f1944f2afb3fb35c" FOREIGN KEY ("group_privacy_id") REFERENCES "group_privacies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
