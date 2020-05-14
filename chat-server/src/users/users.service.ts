import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, createQueryBuilder, Repository } from "typeorm";
import { User } from "./user.entity";
import { Message } from "../messages/messages.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
    ) {
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findMsgsOfChat(user1: number, user2: number): Promise<any> {
        return await createQueryBuilder('Message')
            .where(new Brackets(qb => {
                qb.where('Message.sender = :id1', { id1: user1 })
                    .andWhere('Message.receiver = :id2', { id2: user2 })
            }))
            .orWhere(new Brackets(qb => {
                qb.where('Message.sender = :id3', {id3: user2})
                    .andWhere('Message.receiver = :id4', {id4: user1})
            }))
            .getMany();
    }

    // returns messages that user sent
    async findMsgsOfUser(id: number): Promise<any> {
        return await createQueryBuilder('User')
            .leftJoinAndSelect('User.sent_messages', 'messages')
            .where('User.id = :id', { id })
            .getMany();
    }

    async findOne(id: number): Promise<User> {
        return await this.usersRepository.findOne(id);
    }

    async create(firstName: string, lastName: string): Promise<User> {
        let user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        await user.save();
        return user;
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
