import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinTable, BeforeInsert} from "typeorm";
import { TableNames } from '../TableNames';
import { Message } from "../messages/messages.entity";
import bcrypt from "bcrypt";

@Entity({name: TableNames.User})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @BeforeInsert()
    hashPassword() {
        this.password = bcrypt(this.password, "verytopsecrethash").digest('hex');
    }

    @Column()
    email: string;

    @Column({name: 'first_name', default: ''})
    firstName: string;

    @Column({name: 'last_name', default: ''})
    lastName: string;

    @OneToMany(type => Message, message => message.sender)
    @JoinTable()
    sent_messages: Message[];

    @OneToMany(type => Message, message => message.receiver)
    @JoinTable()
    received_messages: Message[];

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;
}
