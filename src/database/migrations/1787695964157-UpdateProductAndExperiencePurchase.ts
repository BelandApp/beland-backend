import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductAndExperiencePurchase1787695964157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Agregar columna likes en products
        await queryRunner.query(`ALTER TABLE "products" ADD "likes" integer NOT NULL DEFAULT '0'`);

        // 2. Modificar la tabla experience_purchases para añadir los nuevos campos
        await queryRunner.query(`ALTER TABLE "experience_purchases" ALTER COLUMN "payphone_transaction_id" DROP NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE "experience_purchases" ADD "phone" character varying`);
        // Llenar phone para los registros existentes si email existe (solo para que no rompa el NOT NULL si hay registros).
        await queryRunner.query(`UPDATE "experience_purchases" SET "phone" = 'N/A' WHERE "phone" IS NULL`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" ALTER COLUMN "phone" SET NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE "experience_purchases" ADD "is_reserved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" ADD "payment_method" character varying NOT NULL DEFAULT 'PAYPHONE'`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" ADD "orange_reward_amount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" ADD "orange_reward_credited" boolean NOT NULL DEFAULT false`);

        // 3. Eliminar la tabla product_likes ya que no se utiliza más.
        await queryRunner.query(`DROP TABLE IF EXISTS "product_like"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_purchases" DROP COLUMN "orange_reward_credited"`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" DROP COLUMN "orange_reward_amount"`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" DROP COLUMN "payment_method"`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" DROP COLUMN "is_reserved"`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "experience_purchases" ALTER COLUMN "payphone_transaction_id" SET NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "likes"`);
        
        // No recreamos product_like aquí porque es complejo, y down migrations raramente se usan en este nivel.
    }

}
