import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1766214800073 implements MigrationInterface {
    name = 'UpdateDataBase1766214800073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merchants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "legal_name" character varying(150), "ruc" character varying(20), "description" text, "phone" character varying(20), "email" character varying(100), "address_id" uuid NOT NULL, "website" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_698f612a3134c503f711479a4e" UNIQUE ("user_id"), CONSTRAINT "PK_4fd312ef25f8e05ad47bfe7ed25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_6018477317389aba7db348042ee" UNIQUE ("code"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drivers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "motivation_bio" text, "profile_tagline" text, "face_image_url" text, "vehicle_type_id" uuid NOT NULL, "vehicle_description" text, "vehicle_plate" text, "vehicle_image_url" text, "is_active" boolean NOT NULL DEFAULT true, "work_address_id" uuid, "license_number" text, "rating" double precision NOT NULL DEFAULT '0', "total_deliveries" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_8e224f1b8f05ace7cfc7c76d03" UNIQUE ("user_id"), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "province"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "user_address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_859edfd0f29a1ef47cda9655d7f" FOREIGN KEY ("user_address_id") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_25a870d1b98cf4195f9bd1eb16e" FOREIGN KEY ("address_id") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_698f612a3134c503f711479a4e5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_8e224f1b8f05ace7cfc7c76d03b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_79d336c62b18524975b5480dc05" FOREIGN KEY ("vehicle_type_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_722b6fdd68d28a15b2287d956a4" FOREIGN KEY ("work_address_id") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_722b6fdd68d28a15b2287d956a4"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_79d336c62b18524975b5480dc05"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_8e224f1b8f05ace7cfc7c76d03b"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_698f612a3134c503f711479a4e5"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_25a870d1b98cf4195f9bd1eb16e"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_859edfd0f29a1ef47cda9655d7f"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "user_address_id"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "country" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "province" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "city" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "address" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "category" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "longitude" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "latitude" numeric(10,7)`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "merchants"`);
    }

}
