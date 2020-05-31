import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinTable, BeforeInsert} from "typeorm";
import { TableNames } from '../TableNames';
import { Message } from "../messages/messages.entity";
import * as bcrypt from 'bcrypt';

@Entity({name: TableNames.User})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({
        length: 1
    })
    gender: string; // M/F

    @Column()
    age: number;

    @Column("text")
    biography: string;

    @Column()
    pp_url: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at"})
    createdAt: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "last_online"})
    lastOnline: string;

    @Column()
    conversations: number;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @Column()
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
