import {
    BadRequestException,
    CallHandler,
    Controller,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {Crud, CrudAuth, CrudRequestInterceptor} from "@nestjsx/crud";
import {User} from "../users/user.entity";
import {UsersService} from "../users/users.service";
import {AuthGuard} from "@nestjs/passport";
import {Observable} from "rxjs";

@Injectable()
export class IsAdmin implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        console.log(req.user);
        if(req.user.isAdmin)
            return next.handle();
        else
            throw new BadRequestException("You are unauthorized.");
    }
}

@Crud({
    model: {
        type: User,
    },
})
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(IsAdmin, CrudRequestInterceptor)
export class AdminController {
    constructor(public service: UsersService) {}
}
