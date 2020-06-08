import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {NestExpressApplication} from "@nestjs/platform-express";
import {PassportModule} from "@nestjs/passport";
import * as session from 'express-session';
import * as passport from "passport";



async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true
    });


    app.enableCors();
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        next();
    });
    await app.listen(3000, '0.0.0.0');
}

bootstrap();
