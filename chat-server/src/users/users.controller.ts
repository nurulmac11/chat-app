import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    getHello(): {} {
        return "Hello Users";
    }

    @Get("all")
    getUsers(): {} {
        return this.usersService.findAll();
    }

    @Get("user/:id")
    getUser(@Param('id') id): any {
        return this.usersService.findOne(id);
    }

    @Get("messages/:id")
    getMessages(@Param('id') id): {} {
        return this.usersService.findMsgsOfUser(id);
    }

    @Get("chat/:user1/:user2")
    getChat(
        @Param('user1') user1,
        @Param('user2') user2
    ): {} {
        return this.usersService.findMsgsOfChat(user1, user2);
    }

    @Post('create')
    createUser(
        @Body('first_name') firstName: string,
        @Body('last_name') lastName: string,
    ): any {
        return this.usersService.create(firstName, lastName);
    }

}
