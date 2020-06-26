import { Module } from "@nestjs/common";
import { Connection } from "typeorm";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { MessagesModule } from "./messages/messages.module";
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        MessagesModule,
        ChatModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: []
})
export class AppModule {
    constructor(private readonly connection: Connection) {
    }
}
