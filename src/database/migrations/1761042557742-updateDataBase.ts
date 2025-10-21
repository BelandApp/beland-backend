import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDataBase1761042557742 implements MigrationInterface {
    name = 'UpdateDataBase1761042557742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupons" DROP CONSTRAINT "FK_coupon_created_by_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_coupons_code"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "created_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "event_pass" ADD "images_urls" character varying array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "images_urls"`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD "created_by_user_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_coupons_code" ON "coupons" ("code") WHERE (code IS NOT NULL)`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD CONSTRAINT "FK_coupon_created_by_user" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
