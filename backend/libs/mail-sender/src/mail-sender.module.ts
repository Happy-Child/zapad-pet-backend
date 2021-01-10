import { Module } from '@nestjs/common';
import { MailSenderService } from './services/mail-sender.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MailSenderService],
  exports: [MailSenderService],
})
export class MailSenderModule {}
