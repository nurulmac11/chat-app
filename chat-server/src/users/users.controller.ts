import {BadRequestException, Body, Controller, Get, Logger, Param, Post, UseGuards} from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }


    private logger: Logger = new Logger('UsersController');

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
        return this.usersService.findById(id);
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
    async createUser(
        @Body('username') username: string,
        @Body('password') password: string,
        @Body('email') email: string,
        @Body('gender') gender: string,
        @Body('age') age: number,
    ): Promise<any> {
        const result = await this.usersService.create(username, password, email, gender, age);
        if(!result)
            throw new BadRequestException("This username has taken.");
        return result;
    }

    @Post('login')
    async loginUser(
        @Body('username') username: string,
        @Body('password') password: string,
    ): Promise<any> {
        const result = await this.usersService.login(username, password);
        if(!result)
            throw new BadRequestException('Invalid user or password!');
        return result;
    }

}
