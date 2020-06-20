import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import {BadRequestException, Logger, UseGuards} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {JwtService} from "../users/jwt/jwt.service";
import {MessagesService} from "../messages/messages.service";
import {UsersService} from "../users/users.service";
import {WsJwtGuard} from "../users/jwt/WSjwt.strategy";

@WebSocketGateway(81)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private currentUsers = {};
    private conversations = {};

    constructor(
        private jwtService: JwtService,
        private readonly messagesService: MessagesService,
        private readonly usersService: UsersService
    ) {
    }

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('msgToServer')
    @UseGuards(WsJwtGuard)
    async handleMessage(client: Socket, payload: any): Promise<any> {
        const clientUser = client.handshake.query.user;
        const sender = await this.usersService.findUserById(clientUser.id);

        let delivered = 0;
        let receiver = undefined;
        let countFlag = false;
        if (payload.to.id !== payload.to.username) {
            // anon => user
            receiver = await this.usersService.findUserById(payload.to.id);
            payload.from = {
                username: sender.anonymousName,
                id: sender.anonymousName,
                lastOnline: sender.lastOnline
            };
            countFlag = true;
        } else {
            // user => anon
            receiver = await this.usersService.findByAnon(payload.to.username);
            payload.to = {
                username: receiver.username,
                id: receiver.id,
                lastOnline: receiver.lastOnline
            }
        }

        // Block blocked users
        const blockPayload = await this.usersService.findUserWithBlocks(receiver.id);
        let permit = true;
        blockPayload.blocks.forEach(blocked => {
            if (blocked.blocked.id === clientUser.id) {
                permit = false;
            }
        })
        if (!permit) {
            this.server.to(client.id).emit('exception',
                "You are blocked by this person, your messages will not be delivered!");
            return;
        }

        // Count conversation count
        if (!(receiver.id in this.conversations))
                this.conversations[receiver.id] = []

        const chatList = this.conversations[receiver.id];
        if (!chatList.includes(sender.id) && countFlag) {
            // increment count and append it
            this.conversations[receiver.id].push(sender.id);
            await this.usersService.incrementConversationCount(receiver.id)
        }

        if (receiver.id in this.currentUsers) {
            const sendTo = this.currentUsers[receiver.id];
            // message delivered, no need to save ?
            // think about data collection:)
            delivered = 1;
            this.server.to(sendTo).emit('chat', payload);
        } else {
            await this.messagesService.sendMsg(sender.id, receiver.id, payload.text, delivered);
        }
    }

    @SubscribeMessage('loginMe')
    @UseGuards(WsJwtGuard)
    loginMe(client: Socket, username: string): void {
        this.logger.log('LoginMe');
        const clientUser = client.handshake.query.user;
        this.currentUsers[clientUser.id] = client.id;

        // join user to private room
        client.join(client.id);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
        this.logger.log(this.currentUsers)
    }

    handleDisconnect(client: Socket) {
        const clientUser = client.handshake.query.user;
        this.logger.log(`Client disconnected: ${client.id}`);

        if (clientUser) {
            this.usersService.disconnected(clientUser.id);
            delete this.currentUsers[clientUser.id];
            delete this.conversations[clientUser.id]
        }
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
