import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { LoginBodyDto } from '../dtos/login.dto';
import {
  FinishResetPasswordBodyDto,
  ResetPasswordQueryDto,
} from '../dtos/reset-password.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '@libs/entities';
import { RegistrationBodyDto } from '../dtos/registration.dto';
import {
  ERRORS,
  JWT_TOKEN_TO_MAIL_TIME,
  PASSWORD_SALT,
  PATH_CONFIRM_MAIL,
  PATH_RESET_PASSWORD,
} from '@libs/constants';
import { MailSenderService } from '@libs/mail-sender';
import { PugEngineService } from '@libs/pug-engine';
import { LoginResponseDto } from '../dtos/login.dto';
import {
  NotFoundError,
  ForbiddenError,
  TExceptionValidationError,
} from '@libs/exceptions';
import {
  TEXT_SEND_MESSAGE_FROM_SITE,
  TEXTS_FOR_REGISTRATION,
  TEXTS_FOR_RESET_PASSWORD,
} from '@libs/static-text/texts/mail.text';
import { getFrontUrlForPath } from '../../../libs/helpers/src/helpers/getFrontUrl';
import {
  ConfirmEmailQueryDto,
  FinishConfirmEmailBodyDto,
} from '../dtos/confirm-email.dto';
import { TJwtPayload } from '../types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailSender: MailSenderService,
    private readonly jwtService: JwtService,
    private readonly pugEngineService: PugEngineService,
  ) {}

  public async login(data: LoginBodyDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOrFailByEmail(data.email);

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

    const payload = this.getUserPayload(user);
    const token = this.jwtService.sign(payload);

    return new LoginResponseDto({
      user,
      token,
    });
  }

  public async registration(data: RegistrationBodyDto): Promise<boolean> {
    const userExists = await this.userRepository.findBy(data.email);

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

    const confirmPath = this.getConfirmUrlForMail(
      data as User,
      PATH_CONFIRM_MAIL,
    );
    const html = this.pugEngineService.readFile('/confirm-mail-for-register', {
      name: data.name,
      confirmUrl: getFrontUrlForPath(confirmPath),
    });

    await this.mailSender.send({
      from: TEXT_SEND_MESSAGE_FROM_SITE,
      to: data.email,
      subject: TEXTS_FOR_REGISTRATION.SUBJECT,
      html,
    });

    return true;
  }

  public async sendMailByConfirmEmail({
    email,
  }: ConfirmEmailQueryDto): Promise<boolean> {
    const user = await this.userRepository.findOrFailByEmail(email);

    const confirmPath = this.getConfirmUrlForMail(user, PATH_CONFIRM_MAIL);

    const html = this.pugEngineService.readFile('/confirm-mail-for-register', {
      name: user.name,
      confirmUrl: getFrontUrlForPath(confirmPath),
    });

    return await this.mailSender.send({
      from: TEXT_SEND_MESSAGE_FROM_SITE,
      to: user.email,
      subject: TEXTS_FOR_RESET_PASSWORD.SUBJECT,
      html: html,
    });
  }

  public async finishConfirmEmail({
    token,
  }: FinishConfirmEmailBodyDto): Promise<boolean> {
    const payload = this.getPayloadTokenOrFail(token);
    const user = await this.userRepository.findOrFailByEmail(payload.userEmail);

    user.confirm_email = true;
    await this.userRepository.save(user);

    return true;
  }

  public async sendEmailByResetPassword(
    data: ResetPasswordQueryDto,
  ): Promise<boolean> {
    const user = await this.userRepository.findOrFailByEmail(data.email);

    const confirmPath = this.getConfirmUrlForMail(user, PATH_RESET_PASSWORD);

    const html = this.pugEngineService.readFile('/reset-password', {
      name: user.name,
      confirmUrl: getFrontUrlForPath(confirmPath),
    });

    return await this.mailSender.send({
      from: TEXT_SEND_MESSAGE_FROM_SITE,
      to: user.email,
      subject: TEXTS_FOR_RESET_PASSWORD.SUBJECT,
      html: html,
    });
  }

  public async finishResetPassword({
    token,
    password,
  }: FinishResetPasswordBodyDto): Promise<boolean> {
    const payload = this.getPayloadTokenOrFail(token);
    const user = await this.userRepository.findOrFailByEmail(payload.userEmail);

    user.password = await bcrypt.hash(password, PASSWORD_SALT);
    await this.userRepository.save(user);

    return true;
  }

  public async me(email): Promise<User> {
    return await this.userRepository.findBy(email);
  }

  private getPayloadTokenOrFail(token: string): TJwtPayload {
    try {
      const { userId, userEmail } = this.jwtService.verify<TJwtPayload>(token);
      return { userId, userEmail };
    } catch (e) {
      const error: TExceptionValidationError[] = [
        {
          field: 'token',
          message: e.massage,
          errors: [{ errorCode: ERRORS.JWT_TOKEN_EXPIRED }],
        },
      ];
      throw new ForbiddenError(error);
    }
  }

  private getConfirmUrlForMail(user: User, frontUrl: string) {
    const payload = this.getUserPayload(user);
    const token = this.jwtService.sign(payload, {
      expiresIn: JWT_TOKEN_TO_MAIL_TIME,
    });
    return `${frontUrl}?token=${token}`;
  }

  private getUserPayload(user: User): TJwtPayload {
    return { userId: user.id, userEmail: user.email };
  }

  public async removeAllUsers() {
    const allUsers = await this.userRepository.find();
    return await this.userRepository.remove(allUsers);
  }
}
