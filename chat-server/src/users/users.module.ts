import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { Message } from "../messages/messages.entity";
import {JwtService} from "./jwt/jwt.service";
import {JwtStrategy} from "./jwt/jwt.strategy";
import {MulterModule} from "@nestjs/platform-express";
import {Favorites} from "./favorites.entity";
import {WsJwtGuard} from "./jwt/WSjwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Message,
        ]),
        MulterModule.register({
            dest: './uploads/avatar',
        }),
    ],
    providers: [UsersService, JwtService, JwtStrategy, Favorites, WsJwtGuard],
    controllers: [UsersController],
    exports: [JwtService, UsersService, JwtStrategy, WsJwtGuard]
})
export class UsersModule {
}
