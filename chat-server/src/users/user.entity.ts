import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    JoinTable,
    BeforeInsert,
    Index,
    OneToOne
} from "typeorm";
import { TableNames } from '../TableNames';
import { Message } from "../messages/messages.entity";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {Favorites} from "./favorites.entity";
import {Blocks} from "./blocks.entity";
import {Reports} from "./reports.entity";

@Entity({name: TableNames.User})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Index()
    @Column({unique: true})
    anonymousName: string;

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

    @BeforeInsert()
    async createUUID() {
        this.anonymousName = uuidv4();
    }

    @Column({unique: true})
    email: string;

    @Column({})
    ipAddress: string;

    @OneToMany(type => Message, message => message.sender)
    @JoinTable()
    sentMessages: Message[];

    @OneToMany(type => Message, message => message.receiver)
    @JoinTable()
    receivedMessages: Message[];

    @OneToMany(type => Favorites, favorites => favorites.user)
    @JoinTable()
    favorites: Favorites[];

    @OneToMany(type => Favorites, favorited => favorited.favorite)
    favorited: Favorites[];

    @OneToMany(type => Blocks, blocks => blocks.user)
    @JoinTable()
    blocks: Blocks[];

    @OneToMany(type => Blocks, blocked => blocked.blocked)
    blocked: Blocks[];

    @OneToMany(type => Reports, reports => reports.user)
    @JoinTable()
    reports: Reports[];

    @Column({ default: false })
    isOnline: boolean;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ default: false, name: 'is_admin' })
    isAdmin: boolean;
}
