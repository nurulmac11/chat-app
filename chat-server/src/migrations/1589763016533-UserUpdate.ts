import {MigrationInterface, QueryRunner} from "typeorm";

export class UserUpdate1589763016533 implements MigrationInterface {
    name = 'UserUpdate1589763016533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `messages` DROP FOREIGN KEY `FK_2db9cf2b3ca111742793f6c37ce`", undefined);
        await queryRunner.query("ALTER TABLE `messages` DROP FOREIGN KEY `FK_acf951a58e3b9611dd96ce89042`", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `created_at` `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `senderId` `senderId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `receiverId` `receiverId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `created_at` `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `senderId` `senderId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `receiverId` `receiverId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `created_at` `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `senderId` `senderId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `receiverId` `receiverId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `FK_2db9cf2b3ca111742793f6c37ce` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `FK_acf951a58e3b9611dd96ce89042` FOREIGN KEY (`receiverId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `messages` DROP FOREIGN KEY `FK_acf951a58e3b9611dd96ce89042`", undefined);
        await queryRunner.query("ALTER TABLE `messages` DROP FOREIGN KEY `FK_2db9cf2b3ca111742793f6c37ce`", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `receiverId` `receiverId` int NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `senderId` `senderId` int NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `created_at` `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `receiverId` `receiverId` int NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `senderId` `senderId` int NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `created_at` `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `receiverId` `receiverId` int NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `senderId` `senderId` int NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `messages` CHANGE `created_at` `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()", undefined);
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `FK_acf951a58e3b9611dd96ce89042` FOREIGN KEY (`receiverId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `FK_2db9cf2b3ca111742793f6c37ce` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

}
