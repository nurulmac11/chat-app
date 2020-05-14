import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { User } from "../users/user.entity";
import { Message } from '../messages/messages.entity';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Message, User])],
    providers: [ChatService, ChatGateway],
    controllers: [ChatController]
})
export class ChatModule {
}
