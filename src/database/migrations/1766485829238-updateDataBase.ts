import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1766485829238 implements MigrationInterface {
    name = 'UpdateDataBase1766485829238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "social_networks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(255), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_fb34f36d3a4f268397ecdb620c4" UNIQUE ("code"), CONSTRAINT "PK_973974c10fd4f3f1625c24178cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "content_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(255), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_2eb9b4bd7719f13d55a4dea080c" UNIQUE ("code"), CONSTRAINT "PK_1e90dab7a3f22189b39b01445a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "creators" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "category_id" uuid NOT NULL, "main_social_network_id" uuid NOT NULL, "bio" character varying(255), "main_link" character varying(255), "followers_count" integer, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_864c435572b9eccb3e6d9e3fb0" UNIQUE ("user_id"), CONSTRAINT "PK_b27dd693f7df17bbfc21f00166a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recyclers" ADD "address_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recyclers" ADD CONSTRAINT "FK_14a026cec062fc4e9e7330c2716" FOREIGN KEY ("address_id") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creators" ADD CONSTRAINT "FK_864c435572b9eccb3e6d9e3fb0d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creators" ADD CONSTRAINT "FK_a784cbb133821c5dcd4ca19e487" FOREIGN KEY ("category_id") REFERENCES "content_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creators" ADD CONSTRAINT "FK_9b30e22e856f12b83605ad8c2b5" FOREIGN KEY ("main_social_network_id") REFERENCES "social_networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creators" DROP CONSTRAINT "FK_9b30e22e856f12b83605ad8c2b5"`);
        await queryRunner.query(`ALTER TABLE "creators" DROP CONSTRAINT "FK_a784cbb133821c5dcd4ca19e487"`);
        await queryRunner.query(`ALTER TABLE "creators" DROP CONSTRAINT "FK_864c435572b9eccb3e6d9e3fb0d"`);
        await queryRunner.query(`ALTER TABLE "recyclers" DROP CONSTRAINT "FK_14a026cec062fc4e9e7330c2716"`);
        await queryRunner.query(`ALTER TABLE "recyclers" DROP COLUMN "address_id"`);
        await queryRunner.query(`DROP TABLE "creators"`);
        await queryRunner.query(`DROP TABLE "content_categories"`);
        await queryRunner.query(`DROP TABLE "social_networks"`);
    }

}
