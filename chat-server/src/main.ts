import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ChatGateway } from './chat/chat.gateway';
import {NestExpressApplication} from "@nestjs/platform-express";



async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true
    });



    await app.listen(3000);
}

bootstrap();
