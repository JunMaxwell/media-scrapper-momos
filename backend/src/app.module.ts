import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailSenderModule } from './mail-sender/mail-sender.module';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 50,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    MailSenderModule,
    ScraperModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
