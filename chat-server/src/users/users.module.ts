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
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {MailConfig} from '../MailConfig';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Message,
        ]),
        MulterModule.register({
            dest: './uploads/avatar',
        }),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: MailConfig.user,
                        pass: MailConfig.key,
                    },
                    defaults: {
                        from:'"nest-modules" <modules@nestjs.com>',
                    },
                    template: {
                        dir: process.cwd() + '/templates/',
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                },
            }),
        }),
    ],
    providers: [UsersService, JwtService, JwtStrategy, Favorites, WsJwtGuard],
    controllers: [UsersController],
    exports: [JwtService, UsersService, JwtStrategy, WsJwtGuard]
})
export class UsersModule {
}
