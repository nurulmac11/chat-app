import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { TableNames } from '../TableNames';
import { User } from "../users/user.entity";

@Entity({name: TableNames.Message})
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at"})
    createdAt: string;

    @ManyToOne(type => User, user => user.sent_messages)
    sender: User;

    @ManyToOne(type => User, user => user.received_messages)
    receiver: User;

    // 0 => not delivered
    // 1 => delivered
    // 2 => read
    @Column({default: 0})
    read: number;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;
}
