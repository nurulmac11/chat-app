import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    JoinTable,
    Index,
    ManyToOne, OneToOne
} from "typeorm";
import { TableNames } from '../TableNames';
import {User} from "./user.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
@Entity({name: TableNames.Forgot})
export class ForgotPassword extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User, user => user.reset, { onDelete: 'CASCADE' })
    user: User;

    @Column({unique: true})
    key: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "createdAt"})
    createdAt: string;
}
