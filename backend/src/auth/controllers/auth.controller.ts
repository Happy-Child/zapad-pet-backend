import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginBodyDto } from '../dtos/login.body.dto';
import { ResetPasswordQueryDto } from '../dtos/reset-password.query.dto';
import { RegistrationBodyDto } from '../dtos/registration.body.dto';
import { LoginResponseDto } from '../dtos/login.response.dto';

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

  @Get('/reset_password')
  async resetPassword(@Query() ResetPasswordQueryDto: ResetPasswordQueryDto) {
    return this.authService.resetPassword(ResetPasswordQueryDto);
  }
}
