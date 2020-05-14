import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { Message } from "../messages/messages.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Message])],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {
}
