import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import {BadRequestException, Logger, UseGuards} from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {JwtService} from "../users/jwt/jwt.service";
import {MessagesService} from "../messages/messages.service";
import {UsersService} from "../users/users.service";
import {AuthGuard} from "@nestjs/passport";
import {WsJwtGuard} from "../users/jwt/WSjwt.strategy";

@WebSocketGateway(81)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private currentUsers = {};
    private idToUsername = {};

    constructor(
        private jwtService: JwtService,
        private readonly messagesService: MessagesService,
        private readonly usersService: UsersService
    ) {}

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('msgToServer')
    @UseGuards(WsJwtGuard)
    async handleMessage(client: Socket, payload: any): Promise<any> {
        const clientUser = client.handshake.query.user;
        let delivered = 0;
        let receiver = undefined;
        const sender = await this.usersService.findUserById(payload.from);
        if(payload.to.id !== payload.to.username) {
            // anon => user
            receiver = await this.usersService.findUserById(payload.to.id);
            payload.from = {
                username: sender.anonymousName,
                id: sender.anonymousName,
                lastOnline: sender.lastOnline
            };
        } else {
            // user => anon
            receiver = await this.usersService.findByAnon(payload.to.username);
            payload.to = {
                username: receiver.username,
                id: receiver.id,
                lastOnline: receiver.lastOnline
            }
        }
        const sendTo = this.currentUsers[receiver.username];
        if (payload.to.username in this.currentUsers) {
            // message delivered, no need to save ?
            // think about data collection:)
            delivered = 1;
        } else {
            await this.messagesService.sendMsg(sender.id, receiver.id, payload.text, delivered);
        }
        this.server.to(sendTo).emit('chat', payload);
    }

    @SubscribeMessage('loginMe')
    @UseGuards(WsJwtGuard)
    loginMe(client: Socket, username: string): void {
        this.logger.log('LoginMe');

        this.currentUsers[username] = client.id
        this.idToUsername[client.id] = username

        // join user to private room
        client.join(client.id);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
        this.logger.log(this.currentUsers)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);

        const username = this.idToUsername[client.id];
        delete this.currentUsers[username];
        delete this.idToUsername[client.id];
    }

    // Handshake with jwt
    async handleConnection(client: Socket, ...args: any[]) {
        let userC;
        await this.jwtService.verify(
            client.handshake.query.token,
            true
        ).then((user) => {
            userC = user;
            this.logger.log(`Client connected: ${client.id}`);
        }).catch(() => {
            this.logger.error('Where is the token?');
            this.logger.error(client.handshake.query);
        });
        return userC;
    }

    @SubscribeMessage('msg')
    async helloMessage(client: Socket, payload: any): Promise<any> {
        this.logger.log("Message received");
        this.logger.log(payload);
    }
}
