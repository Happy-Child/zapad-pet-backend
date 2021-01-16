import { IsEmail } from 'class-validator';
import { ERRORS } from '@libs/constants';

const commonErrorMessage = { message: ERRORS.INVALID_VALUE };

export class ResetPasswordQueryDto {
  @IsEmail({}, commonErrorMessage)
  email: string;
}
