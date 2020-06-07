import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { Message } from "./messages.entity";
import { User } from "../users/user.entity";
import {JwtStrategy} from "../users/jwt/jwt.strategy";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Message, User]), UsersModule],
    providers: [MessagesService, JwtStrategy],
    controllers: [MessagesController],
    exports: [MessagesService]
})
export class MessagesModule {
}
