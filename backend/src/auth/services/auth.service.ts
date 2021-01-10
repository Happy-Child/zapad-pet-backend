import { Injectable } from '@nestjs/common';
import { LoginBodyDto } from '../dtos/login.body.dto';
import { ResetPasswordQueryDto } from '../dtos/reset-password.query.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { User } from '@libs/entities';
import { NotFoundException } from '@nestjs/common';
import { RegistrationBodyDto } from '../dtos/registration.body.dto';
import { ERRORS, PASSWORD_SALT } from '@libs/constants';
import bcrypt from 'bcrypt';
import { MailSenderService } from '@libs/mail-sender';
import { LoginResponseDto } from '../dtos/login.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailSender: MailSenderService,
  ) {}

  public async login(data: LoginBodyDto): Promise<LoginResponseDto> {
    const user: User | null = await this.userRepository.findBy(data.email);

    if (!user) {
      throw new NotFoundException(ERRORS.INVALID_EMAIL_OR_PASSWORD);
    }

    const confirmPassword = await bcrypt.compare(data.password, user.password);
    if (!confirmPassword) {
      throw new NotFoundException(ERRORS.INVALID_EMAIL_OR_PASSWORD);
    }

    if (!user.confirm_email) {
      throw new NotFoundException(ERRORS.MAIN_NOT_CONFIRMED);
    }

    if (!user.confirm_member) {
      throw new NotFoundException(ERRORS.YOUR_ACCOUNT_IS_NOT_APPROVED_YET);
    }

    const token = 'token';

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
      throw new NotFoundException(ERRORS.EMAIL_ALREADY_EXIST);
    }

    data.password = await bcrypt.hash(data.password, PASSWORD_SALT);

    await this.userRepository.save(data as User);

    await this.mailSender.send({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: data.email,
      subject: 'Hello ✔',
      text: 'REGISTRATION',
      html: '<b>Hello world?</b>',
    });

    return true;
  }

  public async resetPassword(data: ResetPasswordQueryDto): Promise<boolean> {
    const resultSending = await this.mailSender.send({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: data.email,
      subject: 'Hello ✔',
      text: 'RESET PASSWORD',
      html: '<b>Hello world?</b>',
    });

    console.log(resultSending);

    return true;
  }
}
