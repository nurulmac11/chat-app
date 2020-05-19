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
import {UserSchema} from "../users/jwt/user.schema";

@WebSocketGateway(81)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private currentUsers = [];

    constructor(
        private jwtService: JwtService,
    ) {}

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: any): void {
        let authToken = client.handshake.headers.authorization;
        // get the token itself without "Bearer"
        authToken = authToken.split(' ')[1];

        const sendTo = payload.to;
        const msg = payload.text;
        const from = payload.username;
        this.server.to(sendTo).emit('chat', payload);
    }

    @SubscribeMessage('loginMe')
    loginMe(client: Socket, payload: string): void {
        this.logger.log('LoginMe');
        // payload contains user for now.
        this.currentUsers.push({
            username: payload,
            socketId: client.id
        })
        // join user to private room
        client.join(client.id);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
        this.logger.log(this.currentUsers)
        // this.server.emit('activeUsers', this.currentUsers);
        setInterval(() => {
            server.emit('activeUsers', this.currentUsers);
        }, 2000);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.currentUsers = this.currentUsers.filter(item => item.socketId === client.id)
    }

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
}
