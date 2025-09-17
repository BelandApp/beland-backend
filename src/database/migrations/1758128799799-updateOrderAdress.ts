import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderAdress1758128799799 implements MigrationInterface {
    name = 'UpdateOrderAdress1758128799799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6a648e7450e6be2eddfefe79c0c"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "address_ip"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_d39c53244703b8534307adcd073" FOREIGN KEY ("address_id") REFERENCES "user_addresses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_d39c53244703b8534307adcd073"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "address_ip" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6a648e7450e6be2eddfefe79c0c" FOREIGN KEY ("address_ip") REFERENCES "user_addresses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
