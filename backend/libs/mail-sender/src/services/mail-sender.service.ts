import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { TRANSPORTER_DATA } from '../types/transporter-data.types';
import * as config from 'config';

const transporterData: TRANSPORTER_DATA = {
  host: config.MAIL_SENDER.HOST,
  port: config.MAIL_SENDER.PORT,
  secure: true,
  auth: {
    user: config.MAIL_SENDER.USER,
    pass: config.MAIL_SENDER.PASSWORD,
  },
};

@Injectable()
export class MailSenderService {
  private readonly transport: Mail;

  constructor() {
    this.transport = nodemailer.createTransport(transporterData);
  }

  public async send(body: Mail.Options): Promise<boolean> {
    const result = await this.transport.sendMail(body);
    return !!result;
  }
}
