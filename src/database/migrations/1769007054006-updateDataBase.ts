import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDataBase1769007054006 implements MigrationInterface {
  name = 'UpdateDataBase1769007054006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * 1️⃣ Normalizar duplicados
     * Dejamos 1 cart por group_id
     */
    await queryRunner.query(`
      DELETE FROM carts
      WHERE id NOT IN (
        SELECT DISTINCT ON (group_id) id
        FROM carts
        WHERE group_id IS NOT NULL
        ORDER BY group_id, created_at DESC
      )
    `);

    /**
     * 2️⃣ Limpiar group_id huérfanos
     * (groups que ya no existen)
     */
    await queryRunner.query(`
      UPDATE carts c
      SET group_id = NULL
      WHERE group_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
        FROM groups g
        WHERE g.id = c.group_id
      )
    `);

    /**
     * 3️⃣ Eliminar constraints viejos
     */
    await queryRunner.query(`
      ALTER TABLE "carts"
      DROP CONSTRAINT IF EXISTS "FK_664193e2d42d1b188a7b3d0b50f"
    `);

    await queryRunner.query(`
      ALTER TABLE "carts"
      DROP CONSTRAINT IF EXISTS "UQ_664193e2d42d1b188a7b3d0b50f"
    `);

    /**
     * 4️⃣ Eliminar columna vieja
     */
    await queryRunner.query(`
      ALTER TABLE "carts"
      DROP COLUMN IF EXISTS "group_ip"
    `);

    /**
     * 5️⃣ Crear UNIQUE + FK correctos
     */
    await queryRunner.query(`
      ALTER TABLE "carts"
      ADD CONSTRAINT "UQ_eee8c708b173dd926143c68e7b7"
      UNIQUE ("group_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "carts"
      ADD CONSTRAINT "FK_eee8c708b173dd926143c68e7b7"
      FOREIGN KEY ("group_id")
      REFERENCES "groups"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "carts"
      DROP CONSTRAINT IF EXISTS "FK_eee8c708b173dd926143c68e7b7"
    `);

    await queryRunner.query(`
      ALTER TABLE "carts"
      DROP CONSTRAINT IF EXISTS "UQ_eee8c708b173dd926143c68e7b7"
    `);

    await queryRunner.query(`
      ALTER TABLE "carts"
      ADD COLUMN "group_ip" uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "carts"
      ADD CONSTRAINT "UQ_664193e2d42d1b188a7b3d0b50f"
      UNIQUE ("group_ip")
    `);

    await queryRunner.query(`
      ALTER TABLE "carts"
      ADD CONSTRAINT "FK_664193e2d42d1b188a7b3d0b50f"
      FOREIGN KEY ("group_ip")
      REFERENCES "groups"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }
}
