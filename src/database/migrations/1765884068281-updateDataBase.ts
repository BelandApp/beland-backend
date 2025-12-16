import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1765884068281 implements MigrationInterface {
    name = 'UpdateDataBase1765884068281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4e9da7cade0e9edd393329bb326" UNIQUE ("name"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users-profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "profile_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_efd24d88454b83120ef69bacefe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "price_delivery"`);
        await queryRunner.query(`ALTER TABLE "users-profiles" ADD CONSTRAINT "FK_41c301e19c8ba3e98054562cae1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users-profiles" ADD CONSTRAINT "FK_7e716825063baf60fbb6686899a" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users-profiles" DROP CONSTRAINT "FK_7e716825063baf60fbb6686899a"`);
        await queryRunner.query(`ALTER TABLE "users-profiles" DROP CONSTRAINT "FK_41c301e19c8ba3e98054562cae1"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "price_delivery" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "users-profiles"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}
