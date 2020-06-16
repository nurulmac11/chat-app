import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
} from "typeorm";
import { TableNames } from '../TableNames';

@Entity({name: TableNames.Ban})
export class Ban extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({})
    ipAddress: string;
}
