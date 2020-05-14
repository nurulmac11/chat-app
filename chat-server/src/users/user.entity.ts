import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinTable } from "typeorm";
import { TableNames } from '../TableNames';
import { Message } from "../messages/messages.entity";

@Entity({name: TableNames.User})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
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
