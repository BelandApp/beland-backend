import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1766312250568 implements MigrationInterface {
    name = 'UpdateDataBase1766312250568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hubs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "legal_name" character varying(150), "ruc" character varying(20), "description" text, "phone" character varying(20), "email" character varying(100), "address_id" uuid NOT NULL, "website" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_1531a036c5d3522a694d869914" UNIQUE ("user_id"), CONSTRAINT "PK_44b53d1f2b4568b26ce4710b843" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hub_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hub_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "stock_min" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_b09914d8c33f9269db2a10dc482" UNIQUE ("hub_id", "product_id"), CONSTRAINT "PK_bd525ef82fdb2e5533aa314ffa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recyclers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "national_id" character varying(20) NOT NULL, "belongs_to_association" boolean NOT NULL DEFAULT false, "association_name" character varying(150), "has_collection_center" boolean NOT NULL DEFAULT false, "has_mobility" boolean NOT NULL DEFAULT false, "mobility_description" character varying(100), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_251108524635b59196eae5b025f" UNIQUE ("user_id"), CONSTRAINT "UQ_4b842b034742f2bd300ea2f9cfe" UNIQUE ("national_id"), CONSTRAINT "REL_251108524635b59196eae5b025" UNIQUE ("user_id"), CONSTRAINT "PK_6f048fd3c953dc562ba5308ed5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "foundations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "legal_name" character varying(150), "ruc" character varying(20), "description" text, "phone" character varying(20), "email" character varying(100), "address_id" uuid NOT NULL, "website" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_3b40616d4db8ddf6bf74ea95df" UNIQUE ("user_id"), CONSTRAINT "PK_5ae6a07d44f1d160571e159bcce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hubs" ADD CONSTRAINT "FK_71f00dcc4c32b8b4dcaad62cac4" FOREIGN KEY ("address_id") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hubs" ADD CONSTRAINT "FK_1531a036c5d3522a694d8699147" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hub_products" ADD CONSTRAINT "FK_afa01882cdd8d6c64c6d9b537b3" FOREIGN KEY ("hub_id") REFERENCES "hubs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hub_products" ADD CONSTRAINT "FK_95f0d547a761a55441046da351e" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recyclers" ADD CONSTRAINT "FK_251108524635b59196eae5b025f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "foundations" ADD CONSTRAINT "FK_cd2a56bf4d0c8c7bf510533ae2f" FOREIGN KEY ("address_id") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "foundations" ADD CONSTRAINT "FK_3b40616d4db8ddf6bf74ea95dfc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foundations" DROP CONSTRAINT "FK_3b40616d4db8ddf6bf74ea95dfc"`);
        await queryRunner.query(`ALTER TABLE "foundations" DROP CONSTRAINT "FK_cd2a56bf4d0c8c7bf510533ae2f"`);
        await queryRunner.query(`ALTER TABLE "recyclers" DROP CONSTRAINT "FK_251108524635b59196eae5b025f"`);
        await queryRunner.query(`ALTER TABLE "hub_products" DROP CONSTRAINT "FK_95f0d547a761a55441046da351e"`);
        await queryRunner.query(`ALTER TABLE "hub_products" DROP CONSTRAINT "FK_afa01882cdd8d6c64c6d9b537b3"`);
        await queryRunner.query(`ALTER TABLE "hubs" DROP CONSTRAINT "FK_1531a036c5d3522a694d8699147"`);
        await queryRunner.query(`ALTER TABLE "hubs" DROP CONSTRAINT "FK_71f00dcc4c32b8b4dcaad62cac4"`);
        await queryRunner.query(`DROP TABLE "foundations"`);
        await queryRunner.query(`DROP TABLE "recyclers"`);
        await queryRunner.query(`DROP TABLE "hub_products"`);
        await queryRunner.query(`DROP TABLE "hubs"`);
    }

}
