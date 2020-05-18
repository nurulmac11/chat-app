import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(81)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private currentUsers = [];

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: any): void {
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

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
