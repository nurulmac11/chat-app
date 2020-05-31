import {BadRequestException, Injectable, Logger} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, createQueryBuilder, Repository } from "typeorm";
import { User } from "./user.entity";
import { Message } from "../messages/messages.entity";
import { JwtService } from './jwt/jwt.service';
import {UserSchema} from "./jwt/user.schema";
import * as bcrypt from 'bcrypt';

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

    private logger: Logger = new Logger('UserService');

    // JWT METHODS
    async validate(username: string, password: string): Promise<any> {
        const user = await this.findByUsername(username);
        const pass = await bcrypt.compare(password, user.password);
        if(pass)
            return user;
        return false;
    }

    public async login(username: string, password:string): Promise< any | { status: number }>{
        const user = await this.validate(username, password);
        if(!user){
            this.logger.log('usr not found');
            return false;
        } else {
            this.logger.log('usr found!');

        }
        const tokens = await this.jwtService.generateToken(user);

        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            expires_in: 3600,
            // eslint-disable-next-line @typescript-eslint/camelcase
            tokens,
            // eslint-disable-next-line @typescript-eslint/camelcase
            user_id: user.id,
            status: 200
        };
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

    async findById(id: number): Promise<UserSchema> {
        const user = await this.usersRepository.findOne(id);
        const clientSchema = new UserSchema;
        clientSchema.id = user.id;
        clientSchema.username = user.username;
        clientSchema.email = user.email;
        return clientSchema;
    }


    async findByUsername(username: string): Promise<any> {
        const user = await createQueryBuilder('User')
            .where('User.username = :username', { username })
            .getOne();
        return user;
    }

    async idByUsername(username: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: {
                username,
            },
        });
    }


    async create(username: string, password: string, email:string, gender:string, age:number): Promise<any> {
        const user = new User();
        user.username = username;
        user.password = password;
        user.email = email;
        user.gender = gender;
        user.age = age;
        try {
            await user.save();
        } catch(Exception) {
            return false;
        }
        return user;
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
