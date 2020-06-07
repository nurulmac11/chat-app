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

    async sendMsg(sender: number, receiver: number, message: string, delivery: number): Promise<Message> {
        // delivery:
        // 0 => not delivered
        // 1 => delivered
        // 2 => read
        const msg = new Message();
        await User.findOne(sender).then(result => {
            msg.sender = result;
        });
        await User.findOne(receiver).then(result => {
            msg.receiver = result;
        });
        msg.message = message;
        msg.read = delivery;
        await msg.save();
        return msg
    }
}
