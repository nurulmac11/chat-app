import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { User } from "../users/user.entity";
import { Message } from '../messages/messages.entity';
import { ChatGateway } from './chat.gateway';
import {UsersModule} from "../users/users.module";
import {MessagesModule} from "../messages/messages.module";
import {JwtStrategy} from "../users/jwt/jwt.strategy";
import {WsJwtGuard} from "../users/jwt/WSjwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, User]),
        UsersModule,
        MessagesModule,
    ],
    providers: [ChatService, ChatGateway, JwtStrategy, WsJwtGuard],
    controllers: [ChatController],
})
export class ChatModule {
}
