import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinTable, BeforeInsert} from "typeorm";
import { TableNames } from '../TableNames';
import { Message } from "../messages/messages.entity";
import * as bcrypt from 'bcrypt';

@Entity({name: TableNames.User})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({
        length: 1
    })
    gender: string; // M/F

    @Column()
    age: number;

    @Column({type: "text", default: ''})
    biography: string;

    @Column({type: "text", default: ''})
    ppUrl: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "createdAt"})
    createdAt: string;

    @Column({type: "text", default: () => "CURRENT_TIMESTAMP", name: "lastOnline"})
    lastOnline: string;

    @Column({default: 0})
    conversations: number;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @Column({unique: true})
    email: string;

    @OneToMany(type => Message, message => message.sender)
    @JoinTable()
    sent_messages: Message[];

    @OneToMany(type => Message, message => message.receiver)
    @JoinTable()
    received_messages: Message[];

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;
}
