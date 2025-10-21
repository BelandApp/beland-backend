import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1761070507879 implements MigrationInterface {
    name = 'UpdateDataBase1761070507879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_pass_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dac491c0781191b399239ef729a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD CONSTRAINT "FK_dac491c0781191b399239ef729a" FOREIGN KEY ("type_id") REFERENCES "event_pass_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP CONSTRAINT "FK_dac491c0781191b399239ef729a"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "type_id"`);
        await queryRunner.query(`DROP TABLE "event_pass_type"`);
    }

}
