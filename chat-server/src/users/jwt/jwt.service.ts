import {Injectable, HttpStatus, HttpException, Inject, forwardRef} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as os from 'os';

import { WsException } from '@nestjs/websockets';
import {UsersService} from "../users.service";
import {jwtConstants} from "./jwt.constants";
import {UserSchema} from "./user.schema";

@Injectable()
export class JwtService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
    ) {}

    /**
     * Generates a new JWT token
     *
     * @param {User} user - The user to create the payload for the JWT
     * @returns {Promise} tokens - The access and the refresh token
     */
    async generateToken(user: UserSchema): Promise<any> {
        const payload = {
            sub: {
                _id: user.id,
                email: user.email,
                username: user.username
            },
            iss: os.hostname()
        };
        const accessToken = await jwt.sign(payload, jwtConstants.secret, {
            expiresIn: 60*60
        });
        const refreshToken = await jwt.sign(payload, jwtConstants.secret, {
            expiresIn: 7*24*60*60
        });

        return { accessToken, refreshToken };
    }

    async validate(payload: any): Promise<any> {
        return await this.usersService.findById((payload.sub._id));
    }

    /**
     * Validates the token
     *
     * @param {string} token - The JWT token to validate
     * @param {boolean} isWs - True to handle WS exception instead of HTTP exception (default: false)
     */
    async verify(token: string, isWs = false): Promise<UserSchema | null> {
        try {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const payload = <any>jwt.verify(token, jwtConstants.secret);
            const user = await this.usersService.findById(payload.sub._id);

            if (!user) {
                if (isWs) {
                    throw new WsException('Unauthorized access');
                } else {
                    throw new HttpException(
                        'Unauthorized access',
                        HttpStatus.BAD_REQUEST
                    );
                }
            }

            return user;
        } catch (err) {
            if (isWs) {
                throw new WsException(err.message);
            } else {
                throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
            }
        }
    }
}
