import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { JwtAuthGuard } from '../guards/jwt.guard';
import { User } from '@libs/entities';

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
  ): Promise<boolean> {
    return this.authService.sendMailByConfirmEmail(ConfirmEmailQueryDto);
  }

  @Post('/finish-confirm-email')
  async finishConfirmEmail(
    @Body() FinishConfirmEmailBodyDto: FinishConfirmEmailBodyDto,
  ): Promise<boolean> {
    return this.authService.finishConfirmEmail(FinishConfirmEmailBodyDto);
  }

  @Get('/reset-password')
  async sendEmailByResetPassword(
    @Query() ResetPasswordQueryDto: ResetPasswordQueryDto,
  ): Promise<boolean> {
    return this.authService.sendEmailByResetPassword(ResetPasswordQueryDto);
  }

  @Post('/finish-reset-password')
  async finishResetPassword(
    @Body() FinishResetPasswordBodyDto: FinishResetPasswordBodyDto,
  ): Promise<boolean> {
    return this.authService.finishResetPassword(FinishResetPasswordBodyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Req() { user }): Promise<User> {
    return this.authService.me(user.userEmail);
  }

  @Get('/ra')
  async removeAllUsers() {
    return this.authService.removeAllUsers();
  }
}
