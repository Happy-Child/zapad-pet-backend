import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { LoginBodyDto } from '../dtos/login.body.dto';
import { ResetPasswordQueryDto } from '../dtos/reset-password.query.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '@libs/entities';
import { RegistrationBodyDto } from '../dtos/registration.body.dto';
import { ERRORS, PASSWORD_SALT } from '@libs/constants';
import { MailSenderService } from '@libs/mail-sender';
import { LoginResponseDto } from '../dtos/login.response.dto';
import { NotFoundError, TExceptionValidationError } from '@libs/exceptions';
import {
  TEXT_SEND_MESSAGE_FROM_SITE,
  TEXTS_FOR_REGISTRATION,
  TEXTS_FOR_RESET_PASSWORD,
} from '@libs/static-text/texts/mail.text';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailSender: MailSenderService,
    private readonly JwtService: JwtService,
  ) {}

  public async login(data: LoginBodyDto): Promise<LoginResponseDto> {
    const user: User | null = await this.userRepository.findBy(data.email);

    if (!user) {
      const error: TExceptionValidationError[] = [
        {
          field: '',
          errors: [{ errorCode: ERRORS.INVALID_EMAIL_OR_PASSWORD }],
        },
      ];
      throw new NotFoundError(error);
    }

    const confirmPassword = await bcrypt.compare(data.password, user.password);
    if (!confirmPassword) {
      const error: TExceptionValidationError[] = [
        {
          field: '',
          errors: [{ errorCode: ERRORS.INVALID_EMAIL_OR_PASSWORD }],
        },
      ];
      throw new NotFoundError(error);
    }

    if (!user.confirm_email) {
      const error: TExceptionValidationError[] = [
        {
          field: '',
          errors: [{ errorCode: ERRORS.MAIL_NOT_CONFIRMED }],
        },
      ];
      throw new NotFoundError(error);
    }

    if (!user.confirm_member) {
      const error: TExceptionValidationError[] = [
        {
          field: '',
          errors: [{ errorCode: ERRORS.YOUR_ACCOUNT_IS_NOT_APPROVED_YET }],
        },
      ];
      throw new NotFoundError(error);
    }

    const payload = { userId: user.id, userEmail: user.email };
    const token = this.JwtService.sign(payload);

    return {
      user,
      token,
    };
  }

  public async registration(data: RegistrationBodyDto): Promise<boolean> {
    const userExists: User | null = await this.userRepository.findBy(
      data.email,
    );

    if (userExists) {
      const error: TExceptionValidationError[] = [
        {
          field: '',
          errors: [{ errorCode: ERRORS.EMAIL_ALREADY_EXIST }],
        },
      ];
      throw new NotFoundError(error);
    }

    data.password = await bcrypt.hash(data.password, PASSWORD_SALT);

    await this.userRepository.save(data as User);

    await this.mailSender.send({
      from: TEXT_SEND_MESSAGE_FROM_SITE,
      to: data.email,
      subject: TEXTS_FOR_REGISTRATION.SUBJECT,
      html: '<b>Hello world?</b>',
    });

    return true;
  }

  public async resetPassword(data: ResetPasswordQueryDto): Promise<boolean> {
    return await this.mailSender.send({
      from: TEXT_SEND_MESSAGE_FROM_SITE,
      to: data.email,
      subject: TEXTS_FOR_RESET_PASSWORD.SUBJECT,
      html: '<b>Hello world?</b>',
    });
  }
}
