import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBdOrdersAndPayments1756923547352 implements MigrationInterface {
    name = 'UpdateBdOrdersAndPayments1756923547352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6a4e2e91f771d5c19e0ae10252b"`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "transaction_hash" TO "status_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "leader_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "leader_ip"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "status_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "confirmSend" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "confirmReceived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "status_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_name"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_name_enum" AS ENUM('USER', 'LEADER', 'ADMIN', 'SUPERADMIN', 'COMMERCE', 'FUNDATION')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_name" "public"."users_role_name_enum" NOT NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "resources" ALTER COLUMN "limit_user" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_c96c0fd59f3b7282fcf68a6a668" FOREIGN KEY ("status_id") REFERENCES "transaction_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_03a801095cb90cf148e474cfcb7" FOREIGN KEY ("status_id") REFERENCES "transaction_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_03a801095cb90cf148e474cfcb7"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_c96c0fd59f3b7282fcf68a6a668"`);
        await queryRunner.query(`ALTER TABLE "resources" ALTER COLUMN "limit_user" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_name"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_name_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_name" text NOT NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "status_id" text`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "confirmReceived"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "confirmSend"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "status" text NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "leader_ip" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "leader_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "status_id" TO "transaction_hash"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6a4e2e91f771d5c19e0ae10252b" FOREIGN KEY ("leader_ip") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
