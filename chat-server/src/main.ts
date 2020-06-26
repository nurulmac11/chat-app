import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {NestExpressApplication} from "@nestjs/platform-express";
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true
    });

    app.use(helmet());
    app.enableCors();
    // app.use(csurf());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        next();
    });
    await app.listen(3000, '0.0.0.0');
}

bootstrap();
