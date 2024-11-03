import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import config from '../config';
import { JwtStrategy } from './jwt.strategy';
import { MailSenderModule } from '../mail-sender/mail-sender.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../common/services/prisma.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: config.jwt.secretOrKey,
        signOptions: {
          expiresIn: config.jwt.expiresIn,
        },
      }),
      inject: [ConfigService]
    }),
    MailSenderModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
