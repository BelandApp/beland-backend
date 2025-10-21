import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateCouponsTable1760999759212 implements MigrationInterface {
  name = 'CreateCouponsTable1760999759212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = 'coupons';
    const createdByUserIdColumnName = 'created_by_user_id';
    const fkCreatedByUserId = 'FK_coupon_created_by_user';

    // 1. Crear la tabla 'coupons' si no existe (soluciona el error anterior)
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "${tableName}" (
              "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
              "name" text NOT NULL,
              "code" text NULL UNIQUE,
              "type" text NOT NULL,
              "value" numeric(10,2) NOT NULL,
              "max_discount_cap" numeric(10,2) NULL,
              "min_spend_required" numeric(10,2) NULL,
              "expires_at" timestamptz NULL,
              "max_usage_count" integer NULL,
              "usage_limit_per_user" integer NULL,
              "is_active" boolean NOT NULL DEFAULT TRUE,
              "created_at" timestamptz NOT NULL DEFAULT now(),
              "updated_at" timestamptz NOT NULL DEFAULT now(),
              "${createdByUserIdColumnName}" uuid NOT NULL,
              CONSTRAINT "PK_9b2d0b5e9f807f4a2d8a5c3d2f2" PRIMARY KEY ("id")
            );
        `);

    // 2. **Idempotencia de Columna Faltante (Solución al error actual)**
    // Si la tabla existía pero le faltaba esta columna (el escenario que causó el fallo), la añadimos.
    const table = await queryRunner.getTable(tableName);
    const columnExists = table.columns.some(
      (col) => col.name === createdByUserIdColumnName,
    );

    if (!columnExists) {
      // Añadir la columna de forma explícita si faltaba.
      // En este caso, si la tabla ya tiene datos, la adición de una columna NOT NULL sin
      // un valor por defecto fallará. Asumimos que esta migración es inicial.
      await queryRunner.addColumn(
        tableName,
        new TableColumn({
          name: createdByUserIdColumnName,
          type: 'uuid',
          isNullable: false,
          // Si tienes datos, debes agregar un valor por defecto o hacerla nullable temporalmente.
          // Como está definida como NOT NULL en el CREATE, la mantenemos así.
        }),
      );
    }

    // 3. Crear el índice único para el código (si no existe)
    await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "IDX_coupons_code" ON "${tableName}" ("code") WHERE "code" IS NOT NULL;
        `);

    // 4. Añadir la clave foránea a users, solo si no existe
    const existsFk = await queryRunner.query(`
            SELECT 1 FROM pg_constraint WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = '${tableName}') AND conname = '${fkCreatedByUserId}';
        `);

    if (existsFk.length === 0) {
      await queryRunner.createForeignKey(
        tableName,
        new TableForeignKey({
          columnNames: [createdByUserIdColumnName],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          name: fkCreatedByUserId,
          onDelete: 'NO ACTION',
          onUpdate: 'NO ACTION',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = 'coupons';
    const fkCreatedByUserId = 'FK_coupon_created_by_user';

    // 1. Eliminar la clave foránea (de forma segura)
    const table = await queryRunner.getTable(tableName);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.name === fkCreatedByUserId,
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey(tableName, foreignKey);
    }

    // 2. Eliminar el índice (de forma segura)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_coupons_code"`);

    // 3. Eliminar la tabla
    await queryRunner.query(`DROP TABLE IF EXISTS "${tableName}"`);
  }
}
