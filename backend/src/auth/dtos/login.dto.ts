import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import {
  ERRORS,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@libs/constants';
import { Type } from 'class-transformer';
import { User } from '@libs/entities';

const commonErrorMessage = { message: ERRORS.INVALID_VALUE };

export class LoginBodyDto {
  @IsEmail({}, commonErrorMessage)
  email: string;

  @IsString(commonErrorMessage)
  @MinLength(MIN_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_SHORT })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_LONG })
  password: string;
}

export class LoginResponseDto {
  @Type(() => User)
  user: User;

  @IsString(commonErrorMessage)
  token: string;
}
