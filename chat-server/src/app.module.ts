import { Module } from "@nestjs/common";
import { Connection } from "typeorm";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { MessagesModule } from "./messages/messages.module";
import { ChatModule } from './chat/chat.module';
import {DefaultAdminModule} from "nestjs-admin";

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        UsersModule,
        MessagesModule,
        ChatModule,
        DefaultAdminModule
    ],
    controllers: [AppController],
    providers: []
})
export class AppModule {
    constructor(private readonly connection: Connection) {
    }
}
