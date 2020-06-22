import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity, ManyToOne,
} from "typeorm";
import { TableNames } from '../TableNames';
import {User} from "./user.entity";

@Entity({name: TableNames.Report})
export class Reports extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({})
    ipAddress: string;

    @ManyToOne(type => User, user => user.reports)
    user: User;

    @ManyToOne(type => User, user => user.reported)
    reporter: User;

    @Column()
    messages: string;

    @Column()
    imgData: string;
}
