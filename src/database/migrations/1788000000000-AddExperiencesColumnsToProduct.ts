import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddExperiencesColumnsToProduct1788000000000 implements MigrationInterface {
    name = 'AddExperiencesColumnsToProduct1788000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("products", new TableColumn({
            name: "is_experience",
            type: "boolean",
            default: false,
            isNullable: false
        }));
        await queryRunner.addColumn("products", new TableColumn({
            name: "creator_name",
            type: "varchar",
            length: "100",
            default: "'Beland'",
            isNullable: false
        }));
        await queryRunner.addColumn("products", new TableColumn({
            name: "tags",
            type: "text",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "tags");
        await queryRunner.dropColumn("products", "creator_name");
        await queryRunner.dropColumn("products", "is_experience");
    }
}
