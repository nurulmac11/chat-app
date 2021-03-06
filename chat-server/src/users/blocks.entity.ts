import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    JoinTable,
    Index,
    ManyToOne
} from "typeorm";
import { TableNames } from '../TableNames';
import {User} from "./user.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
@Entity({name: TableNames.Blocks})
@Index(["user", "blocked"], { unique: true })
export class Blocks extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.blocks)
    user: User;

    @ManyToOne(type => User, blocked => blocked.blocked)
    @JoinTable()
    blocked: User;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "createdAt"})
    createdAt: string;
}
