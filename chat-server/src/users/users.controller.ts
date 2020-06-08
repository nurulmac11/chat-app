import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Request,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {UsersService} from "./users.service";
import {AuthGuard} from '@nestjs/passport';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }


    private logger: Logger = new Logger('UsersController');

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getHello(): {} {
        return "Hello Users";
    }

    @Get("all")
    @UseGuards(AuthGuard('jwt'))
    getUsers(): {} {
        return this.usersService.findAll();
    }

    @Get("user/:id")
    @UseGuards(AuthGuard('jwt'))
    getUser(@Param('id') id): any {
        return this.usersService.findById(id);
    }

    @Get("random")
    @UseGuards(AuthGuard('jwt'))
    async getRandomUsers(): Promise<any> {
        const userList = await this.usersService.findRandomOnlineUsers();
        return userList;
    }

    @Get("messages/:id")
    @UseGuards(AuthGuard('jwt'))
    getMessages(@Param('id') id): {} {
        return this.usersService.findMsgsOfUser(id);
    }

    @Get("chat/:user1/:user2")
    @UseGuards(AuthGuard('jwt'))
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

    @Post('update-bio')
    @UseGuards(AuthGuard('jwt'))
    async updateBio(
        @Request() req,
        @Body('bio') bio: string,
    ): Promise<any> {
        return await this.usersService.updateBio(req.user.id, bio);
    }


    @Post('update-avatar')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar'))
    async updateAvatar(
        @Request() req,
        @UploadedFile() avatar,
    ): Promise<any> {
        return await this.usersService.updateAvatar(req.user.id, avatar.filename);
    }

    @Get('avatar/:avatar')
    avatar(@Param('avatar') image, @Res() res) {
        return res.sendFile(image, { root: './uploads/avatar' });
    }

    @Post('re-login')
    @UseGuards(AuthGuard('jwt'))
    async reLoginUser(
        @Request() req,
    ): Promise<any> {
        await this.usersService.updateLastOnline(req.user.id)
        return this.usersService.userSerializer(req.user);
    }

    @Post('login')
    async loginUser(
        @Body('username') username: string,
        @Body('password') password: string,
    ): Promise<any> {
        const result = await this.usersService.login(username, password);
        if(!result)
            throw new BadRequestException('Invalid user or password!');
        await this.usersService.updateLastOnline(result.user_id)
        return result;
    }

}
