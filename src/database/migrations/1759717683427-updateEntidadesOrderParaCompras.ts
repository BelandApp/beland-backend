import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntidadesOrderParaCompras1759717683427 implements MigrationInterface {
    name = 'UpdateEntidadesOrderParaCompras1759717683427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_03a801095cb90cf148e474cfcb7"`);
        await queryRunner.query(`CREATE TABLE "delivery_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ef096cbc2fe5594f732a5c202bd" UNIQUE ("code"), CONSTRAINT "PK_7402e08a6496ff740a56399e8b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."admin-becoins_operation_type_enum" AS ENUM('CREATE', 'DESTROY')`);
        await queryRunner.query(`CREATE TABLE "admin-becoins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "becoin" integer NOT NULL, "operation_type" "public"."admin-becoins_operation_type_enum" NOT NULL, "transaction_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_23f779254dde2ce6e92165f5b3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "confirmSend"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "confirmReceived"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "code" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "observation" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_03a801095cb90cf148e474cfcb7" FOREIGN KEY ("status_id") REFERENCES "delivery_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin-becoins" ADD CONSTRAINT "FK_95c0873b290d077e8da73cd9849" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin-becoins" DROP CONSTRAINT "FK_95c0873b290d077e8da73cd9849"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_03a801095cb90cf148e474cfcb7"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "observation"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "confirmReceived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "confirmSend" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "admin-becoins"`);
        await queryRunner.query(`DROP TYPE "public"."admin-becoins_operation_type_enum"`);
        await queryRunner.query(`DROP TABLE "delivery_status"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_03a801095cb90cf148e474cfcb7" FOREIGN KEY ("status_id") REFERENCES "transaction_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
