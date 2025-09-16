import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePricesBecoinProductOrderCart1758022099262 implements MigrationInterface {
    name = 'UpdatePricesBecoinProductOrderCart1758022099262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount_beicon"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "price_becoin" numeric(14,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "unit_becoin" numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "total_becoin" numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "amount_becoin" numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_becoin" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "unit_becoin" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "total_becoin" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "total_becoin" numeric(14,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "UQ_f5939ee0ad233ad35e03f5c65c1"`);
        await queryRunner.query(`ALTER TABLE "group_members" ALTER COLUMN "group_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "unit_price" TYPE numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "total_price" TYPE numeric(14,2)`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "UQ_f5939ee0ad233ad35e03f5c65c1" UNIQUE ("group_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "UQ_f5939ee0ad233ad35e03f5c65c1"`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "total_price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "unit_price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "group_members" ALTER COLUMN "group_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "UQ_f5939ee0ad233ad35e03f5c65c1" UNIQUE ("group_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "total_becoin"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "total_becoin"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "unit_becoin"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_becoin"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount_becoin"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "total_becoin"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "unit_becoin"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price_becoin"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "amount_beicon" numeric(14,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "amount" numeric(14,2) NOT NULL`);
    }

}
