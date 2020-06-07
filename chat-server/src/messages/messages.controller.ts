import {Body, Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import {AuthGuard} from "@nestjs/passport";

@Controller("messages")
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {
    }

    @Get()
    getHello(): {} {
        return "Hello Messages";
    }

    @Post("send")
    @UseGuards(AuthGuard('jwt'))
    sendMessage(
        @Body('sender') sender: number,
        @Body('receiver') receiver: number,
        @Body('message') message: string,
    ): any {
        return this.messagesService.sendMsg(sender, receiver, message, 0);
    }


    @Get("news")
    @UseGuards(AuthGuard('jwt'))
    async newComings(
        @Request() req,
    ): Promise<any> {
        const user = req.user;
        const msgs = await this.messagesService.getUndelivered(user);
        return msgs;
    }

}
