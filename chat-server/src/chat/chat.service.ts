import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { Message } from '../messages/messages.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }



}
