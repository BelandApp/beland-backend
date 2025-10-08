import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1759942834122 implements MigrationInterface {
    name = 'UpdateDataBase1759942834122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_pass" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(100) NOT NULL, "name" character varying(200) NOT NULL, "description" text, "image_url" character varying(255), "event_date" TIMESTAMP NOT NULL, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "limit_tickets" integer NOT NULL DEFAULT '0', "sold_tickets" integer NOT NULL DEFAULT '0', "available" boolean NOT NULL DEFAULT true, "price_becoin" numeric(10,2) NOT NULL, "discount" numeric(10,2) DEFAULT '0', "total_becoin" numeric(10,2) NOT NULL, "created_by_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_42320d7ce9f0815497f1e579f6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD CONSTRAINT "FK_8271fb4d93930e4da4fc00e0d7c" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP CONSTRAINT "FK_8271fb4d93930e4da4fc00e0d7c"`);
        await queryRunner.query(`DROP TABLE "event_pass"`);
    }

}
