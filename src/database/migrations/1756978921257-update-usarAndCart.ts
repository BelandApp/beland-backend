import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsarAndCart1756978921257 implements MigrationInterface {
    name = 'UpdateUsarAndCart1756978921257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "UQ_6385a745d9e12a89b859bb25623" UNIQUE ("cart_id")`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "UQ_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
