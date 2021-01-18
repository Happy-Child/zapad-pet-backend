import {
  IsEmail,
  IsJWT,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ERRORS,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@libs/constants';

const commonErrorMessage = { message: ERRORS.INVALID_VALUE };

export class ResetPasswordQueryDto {
  @IsEmail({}, commonErrorMessage)
  email: string;
}

export class FinishResetPasswordBodyDto {
  @IsString(commonErrorMessage)
  @MinLength(MIN_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_SHORT })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_LONG })
  password: string;

  @IsJWT(commonErrorMessage)
  token: string;
}
