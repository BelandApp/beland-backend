import { MigrationInterface, QueryRunner } from 'typeorm';

// Este es el SQL puro para crear la tabla 'coupon_usages'
export class CreateCouponUsagesTable1761000763603
  implements MigrationInterface
{
  name = 'CreateCouponUsagesTable1761000763603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Crear la tabla 'coupon_usages'
      CREATE TABLE "coupon_usages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "coupon_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "original_amount" numeric(10,2) NOT NULL,
        "discount_amount" numeric(10,2) NOT NULL,
        "order_id" uuid,
        "used_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_coupon_usages_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      -- Crear Índice Compuesto para búsquedas rápidas
      CREATE INDEX "IDX_coupon_usage_coupon_user" ON "coupon_usages" ("coupon_id", "user_id");
    `);

    await queryRunner.query(`
      -- Agregar Clave Foránea a la tabla 'coupons'
      ALTER TABLE "coupon_usages" ADD CONSTRAINT "FK_coupon_usages_coupon_id" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    await queryRunner.query(`
      -- Agregar Clave Foránea a la tabla 'users'
      ALTER TABLE "coupon_usages" ADD CONSTRAINT "FK_coupon_usages_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    // Nota: La clave foránea 'order_id' se puede añadir después si la tabla 'orders' ya existe, o se puede omitir si el uso no está siempre ligado a una orden. Por ahora, solo incluimos las obligatorias.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Eliminar Clave Foránea de users
      ALTER TABLE "coupon_usages" DROP CONSTRAINT "FK_coupon_usages_user_id";
    `);

    await queryRunner.query(`
      -- Eliminar Clave Foránea de coupons
      ALTER TABLE "coupon_usages" DROP CONSTRAINT "FK_coupon_usages_coupon_id";
    `);

    await queryRunner.query(`
      -- Eliminar Índice Compuesto
      DROP INDEX "public"."IDX_coupon_usage_coupon_user";
    `);

    await queryRunner.query(`
      -- Eliminar la tabla 'coupon_usages'
      DROP TABLE "coupon_usages";
    `);
  }
}
