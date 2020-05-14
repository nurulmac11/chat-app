import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
    constructor(private readonly messagesService: ChatService) {
    }

    @Get()
    getHello(): {} {
        return "Hello Chat";
    }

}
