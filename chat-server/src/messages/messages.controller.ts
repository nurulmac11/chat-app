import { Body, Controller, Get, Post } from "@nestjs/common";
import { MessagesService } from "./messages.service";

@Controller("messages")
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {
    }

    @Get()
    getHello(): {} {
        return "Hello Messages";
    }

    @Get("all")
    getMessages(): any {
        return this.messagesService.allMsg();
    }

    @Post("send")
    sendMessage(
        @Body('sender') sender: number,
        @Body('receiver') receiver: number,
        @Body('message') message: string,
    ): any {
        return this.messagesService.sendMsg(sender, receiver, message);
    }
}
