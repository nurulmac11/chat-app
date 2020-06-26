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
import {MailerService} from "@nestjs-modules/mailer";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService,
                private readonly mailerService: MailerService) {
    }


    private logger: Logger = new Logger('UsersController');

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getHello(): {} {
        return "Hello Users";
    }

    @Get("random")
    @UseGuards(AuthGuard('jwt'))
    async getRandomUsers(): Promise<any> {
        const userList = await this.usersService.findRandomOnlineUsers();
        return userList;
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
        if (!result)
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

    @Get('update-last-online')
    @UseGuards(AuthGuard('jwt'))
    async updateLastOnline(
        @Request() req,
    ): Promise<any> {
        return await this.usersService.updateLastOnline(req.user.id);
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
        return res.sendFile(image, {root: './uploads/avatar'});
    }

    @Get('re-login')
    @UseGuards(AuthGuard('jwt'))
    async reLoginUser(
        @Request() req,
    ): Promise<any> {
        await this.usersService.updateLastOnline(req.user.id)
        const user = await this.usersService.findUserById(req.user.id);
        return this.usersService.userSerializer(user);
    }

    @Post('login')
    async loginUser(
        @Body('username') username: string,
        @Body('password') password: string,
    ): Promise<any> {
        const result = await this.usersService.login(username, password);
        if (!result)
            throw new BadRequestException('Invalid user or password!');
        await this.usersService.updateLastOnline(result.user_id)
        return result;
    }

    @Post('add-favorite')
    @UseGuards(AuthGuard('jwt'))
    async addFavorite(
        @Request() req,
        @Body('favorite') favoriteUser: number,
    ): Promise<any> {
        const result = await this.usersService.addFavorite(req.user, favoriteUser);
        if (!result)
            throw new BadRequestException('This user already in your favorites!');
        return result;
    }

    @Post('remove-favorite')
    @UseGuards(AuthGuard('jwt'))
    async removeFavorite(
        @Request() req,
        @Body('favorite') favoriteUser: number,
    ): Promise<any> {
        const result = await this.usersService.removeFavorite(req.user, favoriteUser);
        if (!result)
            throw new BadRequestException('This user already removed!');
        return result;
    }

    @Get('favorites')
    @UseGuards(AuthGuard('jwt'))
    async favorites(
        @Request() req,
    ): Promise<any> {
        const user = await this.usersService.findUserWithFavorites(req.user.id);
        return user;
    }

    @Post('block')
    @UseGuards(AuthGuard('jwt'))
    async block(
        @Request() req,
        @Body('blockID') blockUser: number,
        @Body('blockUsername') blockUsername: string,
    ): Promise<any> {
        const result = await this.usersService.block(req.user, blockUser, blockUsername);
        if (!result)
            throw new BadRequestException('This user already blocked!');
        return result;
    }

    @Post('remove-block')
    @UseGuards(AuthGuard('jwt'))
    async removeBlock(
        @Request() req,
        @Body('blockID') blockUser: number,
        @Body('blockUsername') blockUsername: string,
    ): Promise<any> {
        const result = await this.usersService.removeBlock(req.user, blockUser, blockUsername);
        if (!result)
            throw new BadRequestException('This user already removed!');
        return result;
    }

    @Get('blocks')
    @UseGuards(AuthGuard('jwt'))
    async blocks(
        @Request() req,
    ): Promise<any> {
        const user = await this.usersService.findUserWithBlocks(req.user.id);
        return user;
    }

    @Post('report')
    @UseGuards(AuthGuard('jwt'))
    async report(
        @Request() req,
        @Body('reportID') reportID: number,
        @Body('reportUsername') reportUser: string,
        @Body('messages') messages: object,
    ): Promise<any> {
        const result = await this.usersService.report(req.user, reportID, reportUser, messages);
        if (!result)
            throw new BadRequestException('Something went wrong!');
        return result;
    }

    @Post('forgot-password')
    async resetPassword(
        @Request() req,
        @Body('email') email: string,
    ): Promise<any> {
        const result = await this.usersService.createResetPasswordRequest(email);
        if(result) {
            console.log("Mail will be sent");
            this
                .mailerService
                .sendMail({
                    to: email, // list of receivers
                    from: 'nurullah201@gmail.com', // sender address
                    subject: 'Chatt - Reset password request', // Subject line
                    text: 'Your reset key: ' + result, // plaintext body
                    html: 'Your reset key: ' + result, // HTML body content
                    template: 'forgot-password'
                })
                .then((success) => {
                    console.log(success, "Mail sent.")
                })
                .catch((err) => {
                    console.log(err, "Mail error")
                });
        } else {
            console.log("Mail didn't sent.");
        }
        return true;
    }

}
