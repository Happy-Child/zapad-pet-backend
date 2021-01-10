import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginBodyDto } from '../dtos/login.body.dto';
import { ResetPasswordQueryDto } from '../dtos/reset-password.query.dto';
import { RegistrationBodyDto } from '../dtos/registration.body.dto';
import { LoginResponseDto } from '../dtos/login.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginBodyDto): Promise<LoginResponseDto> {
    return this.authService.login(body);
  }

  @Post('/registration')
  async registration(@Body() body: RegistrationBodyDto): Promise<boolean> {
    return this.authService.registration(body);
  }

  @Get('/reset_password')
  async resetPassword(@Query() query: ResetPasswordQueryDto) {
    return this.authService.resetPassword(query);
  }
}
