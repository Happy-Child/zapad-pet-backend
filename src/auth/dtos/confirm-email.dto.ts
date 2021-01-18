import { IsEmail, IsJWT } from 'class-validator';
import { ERRORS } from '@libs/constants';

const commonErrorMessage = { message: ERRORS.INVALID_VALUE };

export class ConfirmEmailQueryDto {
  @IsEmail({}, commonErrorMessage)
  email: string;
}

export class FinishConfirmEmailBodyDto {
  @IsJWT(commonErrorMessage)
  token: string;
}
