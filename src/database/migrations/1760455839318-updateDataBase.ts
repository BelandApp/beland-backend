import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1760455839318 implements MigrationInterface {
    name = 'UpdateDataBase1760455839318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_event_passes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "event_pass_id" uuid NOT NULL, "holder_name" character varying(100) NOT NULL, "holder_phone" character varying(20), "holder_document" character varying(30), "purchase_date" TIMESTAMP NOT NULL DEFAULT now(), "redemption_date" TIMESTAMP, "is_consumed" boolean NOT NULL DEFAULT false, "purchase_price" numeric(10,2), "is_refunded" boolean NOT NULL DEFAULT false, "refunded_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eb9bd7fff68ab315bf5b6e334ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD "codbar" text`);
        await queryRunner.query(`ALTER TABLE "products" ADD "weight" numeric(7,3) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "becoin_by_recycled" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "ordered_quantity" integer`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "returned_quantity" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivered_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "delivery_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "qr" text`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "attended_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "is_refundable" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "refund_days_limit" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD CONSTRAINT "FK_9c9e2004a3166725a1ff54b24c4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" ADD CONSTRAINT "FK_fd5c957c588b0ea53f3f63efc50" FOREIGN KEY ("event_pass_id") REFERENCES "event_pass"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP CONSTRAINT "FK_fd5c957c588b0ea53f3f63efc50"`);
        await queryRunner.query(`ALTER TABLE "user_event_passes" DROP CONSTRAINT "FK_9c9e2004a3166725a1ff54b24c4"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "refund_days_limit"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "is_refundable"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "attended_count"`);
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "qr"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "delivery_at"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivered_at"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_at"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "returned_quantity"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "ordered_quantity"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "becoin_by_recycled"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "codbar"`);
        await queryRunner.query(`DROP TABLE "user_event_passes"`);
    }

}
