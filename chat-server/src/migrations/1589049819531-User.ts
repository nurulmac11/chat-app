import {MigrationInterface, QueryRunner} from "typeorm";

export class User1589049819531 implements MigrationInterface {
    name = 'User1589049819531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `username`", undefined);
        await queryRunner.query("ALTER TABLE `users` ADD `username` varchar(255) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `username`", undefined);
        await queryRunner.query("ALTER TABLE `users` ADD `username` varchar(255) NOT NULL", undefined);
    }

}
