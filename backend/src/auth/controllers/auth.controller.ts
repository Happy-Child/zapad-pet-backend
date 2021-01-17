import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginBodyDto, LoginResponseDto } from '../dtos/login.dto';
import {
  ResetPasswordQueryDto,
  FinishResetPasswordBodyDto,
} from '../dtos/reset-password.dto';
import { RegistrationBodyDto } from '../dtos/registration.dto';
import {
  ConfirmEmailQueryDto,
  FinishConfirmEmailBodyDto,
} from '../dtos/confirm-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() LoginBodyDto: LoginBodyDto): Promise<LoginResponseDto> {
    return this.authService.login(LoginBodyDto);
  }

  @Post('/registration')
  async registration(
    @Body() RegistrationBodyDto: RegistrationBodyDto,
  ): Promise<boolean> {
    return this.authService.registration(RegistrationBodyDto);
  }

  @Get('/confirm-email')
  async sendMailByConfirmEmail(
    @Query() ConfirmEmailQueryDto: ConfirmEmailQueryDto,
  ) {
    return this.authService.sendMailByConfirmEmail(ConfirmEmailQueryDto);
  }

  @Post('/finish-confirm-email')
  async finishConfirmEmail(
    @Body() FinishConfirmEmailBodyDto: FinishConfirmEmailBodyDto,
  ) {
    return this.authService.finishConfirmEmail(FinishConfirmEmailBodyDto);
  }

  @Get('/reset-password')
  async sendEmailByResetPassword(
    @Query() ResetPasswordQueryDto: ResetPasswordQueryDto,
  ) {
    return this.authService.sendEmailByResetPassword(ResetPasswordQueryDto);
  }

  @Post('/finish-reset-password')
  async finishResetPassword(
    @Body() FinishResetPasswordBodyDto: FinishResetPasswordBodyDto,
  ) {
    return this.authService.finishResetPassword(FinishResetPasswordBodyDto);
  }

  @Get('/ra')
  async removeAllUsers() {
    return this.authService.removeAllUsers();
  }
}
