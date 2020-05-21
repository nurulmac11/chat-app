import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./messages.entity";
import { User } from "../users/user.entity";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }

    async allMsg(): Promise<Message[]> {
        return await this.messagesRepository.find();
    }

    async sendMsg(sender: number, receiver: number, message: string): Promise<Message> {
        const msg = new Message();
        await User.findOne(sender).then(result => {
            msg.sender = result;
        });
        await User.findOne(receiver).then(result => {
            msg.receiver = result;
        });
        msg.message = message;
        await msg.save();
        return msg
    }
}
