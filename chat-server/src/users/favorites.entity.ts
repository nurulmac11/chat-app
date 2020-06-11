import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    JoinTable,
    BeforeInsert,
    Index,
    JoinColumn, OneToOne, ManyToOne
} from "typeorm";
import { TableNames } from '../TableNames';
import { Message } from "../messages/messages.entity";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {User} from "./user.entity";

@Entity({name: TableNames.Favorites})
@Index(["user", "favorite"], { unique: true })
export class Favorites extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.favorited)
    @JoinColumn()
    user: User;

    @ManyToOne(type => User, favorite => favorite.favorites)
    @JoinColumn()
    favorite: User;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "createdAt"})
    createdAt: string;
}
