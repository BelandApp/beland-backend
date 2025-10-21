import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDataBase1760455839318 implements MigrationInterface {
  name = 'UpdateDataBase1760455839318';

  // Función auxiliar para verificar la existencia de una clave foránea
  private async foreignKeyExists(
    queryRunner: QueryRunner,
    tableName: string,
    fkName: string,
  ): Promise<boolean> {
    const result = await queryRunner.query(`
            SELECT 1
            FROM pg_constraint
            WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = '${tableName}')
            AND conname = '${fkName}';
        `);
    return result.length > 0;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear 'user_event_passes'. El IF NOT EXISTS evita errores si la tabla ya existe.
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user_event_passes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "event_pass_id" uuid NOT NULL, "holder_name" character varying(100) NOT NULL, "holder_phone" character varying(20), "holder_document" character varying(30), "purchase_date" TIMESTAMP NOT NULL DEFAULT now(), "redemption_date" TIMESTAMP, "is_consumed" boolean NOT NULL DEFAULT false, "purchase_price" numeric(10,2), "is_refunded" boolean NOT NULL DEFAULT false, "refunded_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eb9bd7fff68ab315bf5b6e334ba" PRIMARY KEY ("id"))`,
    );

    // 2. ALTER TABLE "products" (Verificamos existencia de columnas)
    if (!(await queryRunner.hasColumn('products', 'codbar'))) {
      await queryRunner.query(`ALTER TABLE "products" ADD "codbar" text`);
    }
    if (!(await queryRunner.hasColumn('products', 'weight'))) {
      await queryRunner.query(
        `ALTER TABLE "products" ADD "weight" numeric(7,3) DEFAULT '0'`,
      );
    }
    if (!(await queryRunner.hasColumn('products', 'becoin_by_recycled'))) {
      await queryRunner.query(
        `ALTER TABLE "products" ADD "becoin_by_recycled" integer DEFAULT '0'`,
      );
    }

    // 3. ALTER TABLE "order_items"
    if (!(await queryRunner.hasColumn('order_items', 'ordered_quantity'))) {
      await queryRunner.query(
        `ALTER TABLE "order_items" ADD "ordered_quantity" integer`,
      );
    }
    if (!(await queryRunner.hasColumn('order_items', 'returned_quantity'))) {
      await queryRunner.query(
        `ALTER TABLE "order_items" ADD "returned_quantity" integer DEFAULT '0'`,
      );
    }

    // 4. ALTER TABLE "orders"
    if (!(await queryRunner.hasColumn('orders', 'delivery_at'))) {
      await queryRunner.query(
        `ALTER TABLE "orders" ADD "delivery_at" TIMESTAMP WITH TIME ZONE`,
      );
    }
    if (!(await queryRunner.hasColumn('orders', 'delivered_at'))) {
      await queryRunner.query(
        `ALTER TABLE "orders" ADD "delivered_at" TIMESTAMP WITH TIME ZONE`,
      );
    }

    // 5. ALTER TABLE "carts"
    if (!(await queryRunner.hasColumn('carts', 'delivery_at'))) {
      await queryRunner.query(
        `ALTER TABLE "carts" ADD "delivery_at" TIMESTAMP WITH TIME ZONE`,
      );
    }

    // 6. ALTER TABLE "event_pass"
    if (!(await queryRunner.hasColumn('event_pass', 'qr'))) {
      await queryRunner.query(`ALTER TABLE "event_pass" ADD "qr" text`);
    }
    if (!(await queryRunner.hasColumn('event_pass', 'attended_count'))) {
      await queryRunner.query(
        `ALTER TABLE "event_pass" ADD "attended_count" integer NOT NULL DEFAULT '0'`,
      );
    }
    if (!(await queryRunner.hasColumn('event_pass', 'is_refundable'))) {
      await queryRunner.query(
        `ALTER TABLE "event_pass" ADD "is_refundable" boolean NOT NULL DEFAULT false`,
      );
    }
    if (!(await queryRunner.hasColumn('event_pass', 'refund_days_limit'))) {
      await queryRunner.query(
        `ALTER TABLE "event_pass" ADD "refund_days_limit" integer DEFAULT '0'`,
      );
    }

    // 7. Restricciones de clave foránea (Verificamos existencia antes de crear)
    const fkUserId = 'FK_9c9e2004a3166725a1ff54b24c4';
    const fkEventPassId = 'FK_fd5c957c588b0ea53f3f63efc50';

    if (
      !(await this.foreignKeyExists(queryRunner, 'user_event_passes', fkUserId))
    ) {
      await queryRunner.query(
        `ALTER TABLE "user_event_passes" ADD CONSTRAINT "${fkUserId}" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    }

    if (
      !(await this.foreignKeyExists(
        queryRunner,
        'user_event_passes',
        fkEventPassId,
      ))
    ) {
      await queryRunner.query(
        `ALTER TABLE "user_event_passes" ADD CONSTRAINT "${fkEventPassId}" FOREIGN KEY ("event_pass_id") REFERENCES "event_pass"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const fkUserId = 'FK_9c9e2004a3166725a1ff54b24c4';
    const fkEventPassId = 'FK_fd5c957c588b0ea53f3f63efc50';

    // 1. Eliminar restricciones de clave foránea (Verificamos existencia antes de eliminar)
    if (
      await this.foreignKeyExists(
        queryRunner,
        'user_event_passes',
        fkEventPassId,
      )
    ) {
      await queryRunner.query(
        `ALTER TABLE "user_event_passes" DROP CONSTRAINT "${fkEventPassId}"`,
      );
    }
    if (
      await this.foreignKeyExists(queryRunner, 'user_event_passes', fkUserId)
    ) {
      await queryRunner.query(
        `ALTER TABLE "user_event_passes" DROP CONSTRAINT "${fkUserId}"`,
      );
    }

    // 2. Eliminar columnas (verificamos existencia antes de eliminarlas)
    if (await queryRunner.hasColumn('event_pass', 'refund_days_limit')) {
      await queryRunner.query(
        `ALTER TABLE "event_pass" DROP COLUMN "refund_days_limit"`,
      );
    }
    if (await queryRunner.hasColumn('event_pass', 'is_refundable')) {
      await queryRunner.query(
        `ALTER TABLE "event_pass" DROP COLUMN "is_refundable"`,
      );
    }
    if (await queryRunner.hasColumn('event_pass', 'attended_count')) {
      await queryRunner.query(
        `ALTER TABLE "event_pass" DROP COLUMN "attended_count"`,
      );
    }
    if (await queryRunner.hasColumn('event_pass', 'qr')) {
      await queryRunner.query(`ALTER TABLE "event_pass" DROP COLUMN "qr"`);
    }

    if (await queryRunner.hasColumn('carts', 'delivery_at')) {
      await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "delivery_at"`);
    }

    if (await queryRunner.hasColumn('orders', 'delivered_at')) {
      await queryRunner.query(
        `ALTER TABLE "orders" DROP COLUMN "delivered_at"`,
      );
    }
    if (await queryRunner.hasColumn('orders', 'delivery_at')) {
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_at"`);
    }

    if (await queryRunner.hasColumn('order_items', 'returned_quantity')) {
      await queryRunner.query(
        `ALTER TABLE "order_items" DROP COLUMN "returned_quantity"`,
      );
    }
    if (await queryRunner.hasColumn('order_items', 'ordered_quantity')) {
      await queryRunner.query(
        `ALTER TABLE "order_items" DROP COLUMN "ordered_quantity"`,
      );
    }

    if (await queryRunner.hasColumn('products', 'becoin_by_recycled')) {
      await queryRunner.query(
        `ALTER TABLE "products" DROP COLUMN "becoin_by_recycled"`,
      );
    }
    if (await queryRunner.hasColumn('products', 'weight')) {
      await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "weight"`);
    }
    if (await queryRunner.hasColumn('products', 'codbar')) {
      await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "codbar"`);
    }

    // 3. Eliminar tabla 'user_event_passes'
    await queryRunner.query(`DROP TABLE "user_event_passes"`);
  }
}
