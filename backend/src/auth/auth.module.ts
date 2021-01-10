import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { User } from '@libs/entities';
import { MailSenderModule } from '@libs/mail-sender';

const entities = [User];

@Module({
  imports: [TypeOrmModule.forFeature(entities), MailSenderModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
