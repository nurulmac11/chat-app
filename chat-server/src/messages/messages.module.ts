import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { Message } from "./messages.entity";
import { User } from "../users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Message, User])],
    providers: [MessagesService],
    controllers: [MessagesController]
})
export class MessagesModule {
}
