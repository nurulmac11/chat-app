import {forwardRef, Module} from '@nestjs/common';
import { AdminController } from './admin.controller';
import {UsersModule} from "../users/users.module";

@Module({
    imports: [
        UsersModule
    ],
    controllers: [AdminController],
    providers: []
})
export class AdminModule {}
