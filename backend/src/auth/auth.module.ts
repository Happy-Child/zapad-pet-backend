import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { User } from '@libs/entities';
import { MailSenderModule } from '@libs/mail-sender';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWT_SECRET, JWT_SESSION_TIME } from '@libs/constants';

const entities = [User];

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    MailSenderModule,
    PassportModule,
    JwtModule.register({
      signOptions: {
        expiresIn: JWT_SESSION_TIME,
      },
      secret: JWT_SECRET,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
