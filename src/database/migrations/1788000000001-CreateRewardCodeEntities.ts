import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRewardCodeEntities1788000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear tabla reward_codes
    await queryRunner.createTable(
      new Table({
        name: 'reward_codes',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'code', type: 'varchar', length: '100', isUnique: true },
          { name: 'amount', type: 'numeric', precision: 14, scale: 2 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'max_uses', type: 'integer', isNullable: true },
          { name: 'created_at', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updated_at', type: 'timestamp with time zone', default: 'now()' },
        ],
      }),
      true,
    );

    // 2. Crear tabla reward_redemptions
    await queryRunner.createTable(
      new Table({
        name: 'reward_redemptions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'email', type: 'varchar', length: '255' },
          { name: 'reward_code_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'status', type: 'varchar', default: "'PENDING'" }, // Enum PENDING | APPLIED
          { name: 'created_at', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updated_at', type: 'timestamp with time zone', default: 'now()' },
        ],
      }),
      true,
    );

    // 3. Crear el indice unico crítico por email
    await queryRunner.createIndex(
      'reward_redemptions',
      new TableIndex({
        name: 'idx_reward_redemptions_email_unique',
        columnNames: ['email'],
        isUnique: true,
      }),
    );

    // 4. Claves foráneas
    await queryRunner.createForeignKey(
      'reward_redemptions',
      new TableForeignKey({
        columnNames: ['reward_code_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'reward_codes',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'reward_redemptions',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('reward_redemptions');
    if (table) {
      const fks = table.foreignKeys;
      for (const fk of fks) {
        await queryRunner.dropForeignKey('reward_redemptions', fk);
      }
      const indices = table.indices;
      for (const idx of indices) {
        await queryRunner.dropIndex('reward_redemptions', idx);
      }
    }
    await queryRunner.dropTable('reward_redemptions');
    await queryRunner.dropTable('reward_codes');
  }
}
