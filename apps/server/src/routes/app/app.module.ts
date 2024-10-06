import { MailerModule } from "@nestjs-modules/mailer";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerModule } from "@nestjs/throttler";

import { AwsModule } from "@/common/aws";
import { AuthMiddleware, LoggerMiddleware } from "@/common/middlewares";
import { NetgsmModule } from "@/common/netgsm";
import {
  mailerConfig,
  multerConfig,
  serveStaticConfig,
  throttlerConfig,
} from "@/config";
import { PrismaModule } from "@/prisma";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// Routes
import * as Routes from "@/routes";

const routes = Object.values(Routes);

@Module({
  controllers: [AppController],
  imports: [
    ...routes,
    PrismaModule,
    AwsModule,
    NetgsmModule,
    ThrottlerModule.forRoot(throttlerConfig),
    ServeStaticModule.forRoot(serveStaticConfig),
    MailerModule.forRoot(mailerConfig),
    MulterModule.register(multerConfig),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes("*");
  }
}
