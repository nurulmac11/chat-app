import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from "./jwt.service";
import {jwtConstants} from "./jwt.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any, done: Function) {
        const user = await this.authService.validate(payload);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }

        done(null, user);
    }
}
