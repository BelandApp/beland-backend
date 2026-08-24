import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrarexpirences1787578660450 implements MigrationInterface {
    name = 'Migrarexpirences1787578660450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" DROP CONSTRAINT "FK_experience_purchase_items_product"`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" DROP CONSTRAINT "FK_experience_purchase_items_purchase"`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" DROP CONSTRAINT "FK_8e40cc924716518bc5d1828ce3d"`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" DROP CONSTRAINT "FK_04e8964ee561b922b9e4fd544ed"`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."reward_redemptions_status_enum" AS ENUM('PENDING', 'APPLIED')`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" ADD "status" "public"."reward_redemptions_status_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" ADD CONSTRAINT "FK_f3b64729b6e455b746963614996" FOREIGN KEY ("purchase_id") REFERENCES "experience_purchases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" ADD CONSTRAINT "FK_32c79eedfa7b524ea8ad5393e98" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" ADD CONSTRAINT "FK_04e8964ee561b922b9e4fd544ed" FOREIGN KEY ("reward_code_id") REFERENCES "reward_codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" ADD CONSTRAINT "FK_8e40cc924716518bc5d1828ce3d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reward_redemptions" DROP CONSTRAINT "FK_8e40cc924716518bc5d1828ce3d"`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" DROP CONSTRAINT "FK_04e8964ee561b922b9e4fd544ed"`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" DROP CONSTRAINT "FK_32c79eedfa7b524ea8ad5393e98"`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" DROP CONSTRAINT "FK_f3b64729b6e455b746963614996"`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."reward_redemptions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" ADD CONSTRAINT "FK_04e8964ee561b922b9e4fd544ed" FOREIGN KEY ("reward_code_id") REFERENCES "reward_codes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reward_redemptions" ADD CONSTRAINT "FK_8e40cc924716518bc5d1828ce3d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" ADD CONSTRAINT "FK_experience_purchase_items_purchase" FOREIGN KEY ("purchase_id") REFERENCES "experience_purchases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_purchase_items" ADD CONSTRAINT "FK_experience_purchase_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
