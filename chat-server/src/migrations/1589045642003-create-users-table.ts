import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUsersTable1589044833600 implements MigrationInterface {
    public userTable: Table = new Table({
        name: 'users',
        columns: [
            {
                name: 'id',
                type: 'int',
                isGenerated: true,
                isPrimary: true,
                generationStrategy: 'increment',
            },
            {
                name: 'first_name',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'last_name',
                type: 'varchar',
                isNullable: true,
            },
            {
                name: 'is_active',
                type: 'boolean',
                isNullable: false
            }
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(this.userTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.userTable);
    }

}
