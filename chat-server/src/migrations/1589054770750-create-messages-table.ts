import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createMessagesTable1589054770750 implements MigrationInterface {

    public messageTable: Table = new Table({
        name: 'messages',
        columns: [
            {
                name: 'id',
                type: 'int',
                isGenerated: true,
                isPrimary: true,
                generationStrategy: 'increment',
            },
            {
                name: 'message',
                type: 'varchar',
            },
            {
                name: 'created_at',
                type: 'datetime',
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'sender',
                type: 'int',
            },
            {
                name: 'receiver',
                type: 'int',
            },
            {
                name: 'is_active',
                type: 'boolean',
                isNullable: false
            }
        ],
    });
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `messages` (`id` int NOT NULL AUTO_INCREMENT, `message` varchar(255) NOT NULL, `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, `sender` int NOT NULL, `receiver` int NOT NULL, `is_active` boolean NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `sender_user_fk` FOREIGN KEY (`sender`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE; ");
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `receiver_user_fk` FOREIGN KEY (`receiver`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE; ");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.messageTable);
    }

}
