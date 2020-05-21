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

    private currentUsers = {};
    private idToUsername = {};

    constructor(
        private jwtService: JwtService,
    ) {}

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: any): void {
        this.logger.log("Message received");
        this.logger.log(payload);
        const sendTo = this.currentUsers[payload.to];
        /**
         * Payload:
         *  username, text, to, from
         */
        this.server.to(sendTo).emit('chat', payload);
    }

    @SubscribeMessage('loginMe')
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

        // send user list continuously
        setInterval(() => {
            server.emit('activeUsers', Object.keys(this.currentUsers));
        }, 2000);
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
}
