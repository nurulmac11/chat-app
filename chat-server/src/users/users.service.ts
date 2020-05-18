import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, createQueryBuilder, Repository } from "typeorm";
import { User } from "./user.entity";
import { Message } from "../messages/messages.entity";
import { JwtService } from  '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        private readonly jwtService: JwtService
    ) {
    }

    // JWT METHODS
    async validate(username: string, password: string): Promise<any> {
        return await createQueryBuilder('User')
            .where('User.username = :username', { username })
            .where('User.password = :password', { password })
            .getOne();
    }

    public async login(username: string, password:string): Promise< any | { status: number }>{
        return this.validate(username, password).then((userData)=>{
            if(!userData){
                return { status: 404 };
            }
            const payload = `${userData.username}${userData.id}`;
            const accessToken = this.jwtService.sign(payload);

            return {
                // eslint-disable-next-line @typescript-eslint/camelcase
                expires_in: 3600,
                // eslint-disable-next-line @typescript-eslint/camelcase
                access_token: accessToken,
                // eslint-disable-next-line @typescript-eslint/camelcase
                user_id: payload,
                status: 200
            };

        });
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

    async create(username: string, password: string, email:string): Promise<User> {
        const user = new User();
        user.username = username;
        user.password = password;
        user.email = email;
        await user.save();
        return user;
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
