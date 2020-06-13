import {BadRequestException, CanActivate, ExecutionContext, HttpException, Injectable} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {JwtService} from "./jwt.service";
import {jwtConstants} from "./jwt.constants";
import {User} from "../user.entity";

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private authService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient();
        const authToken = client.handshake.query.token;
        const jwtPayload = jwt.verify(authToken, jwtConstants.secret);
        const user: User = await this.authService.validate(jwtPayload);
        // Bonus if you need to access your user after the guard
        // context.switchToWs().getData().user = user;
        client.handshake.query.user = user;
        if(user) {
            return true;
        } else {
            throw new BadRequestException('INVALID TOKEN!');
        }
    }
}
