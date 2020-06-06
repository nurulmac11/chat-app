import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { Message } from "../messages/messages.entity";
import {JwtService} from "./jwt/jwt.service";
import {JwtStrategy} from "./jwt/jwt.strategy";
import {MulterModule} from "@nestjs/platform-express";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Message,
        ]),
        MulterModule.register({
            dest: './uploads/avatar',
        })
    ],
    providers: [UsersService, JwtService, JwtStrategy],
    controllers: [UsersController],
    exports: [JwtService, UsersService]
})
export class UsersModule {
}
