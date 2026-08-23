import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddClaimedAmountToRewardRedemption1789000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'reward_redemptions',
      new TableColumn({
        name: 'claimed_amount',
        type: 'numeric',
        precision: 14,
        scale: 2,
        isNullable: true,
      }),
    );

    // Update existing records with the current code amount so they aren't left broken
    await queryRunner.query(`
      UPDATE reward_redemptions rr
      SET claimed_amount = rc.amount
      FROM reward_codes rc
      WHERE rr.reward_code_id = rc.id AND rr.claimed_amount IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('reward_redemptions', 'claimed_amount');
  }
}
