import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: true,
        credentials: true
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
