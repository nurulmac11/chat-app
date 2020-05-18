import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { Message } from "../messages/messages.entity";
import {JwtModule} from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Message,
        ]),
        JwtModule.register({
            secretOrPrivateKey: 'secret12356789'
        })
    ],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {
}
