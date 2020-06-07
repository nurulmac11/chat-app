import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {createQueryBuilder, getConnection, getManager, Repository} from "typeorm";
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

    async getUndelivered(user: User): Promise<any> {
        const result = await getManager()
            .createQueryBuilder(Message, 'message')
            .addSelect('message.message')
            .addSelect('message.receiverId')
            .addSelect('message.created_at')
            .addSelect('user.anonymousName')
            .innerJoin("User", 'user', 'message.sender = user.id')
            .where('message.receiver.id = :id', {id: user.id})
            .getRawMany()
        result.forEach(msg => {
            delete msg.message_senderId;
        })

        // delete after retrieving
        // todo enable after
        // await getConnection()
        //     .createQueryBuilder()
        //     .delete()
        //     .from(Message)
        //     .where("receiver = :id", { id: user.id })
        //     .execute();
        return result
    }

}
