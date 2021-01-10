import { IsString } from 'class-validator';
import { ERRORS } from '@libs/constants';
import { User } from '@libs/entities';
import { Type } from 'class-transformer';

const commonErrorMessage = { message: ERRORS.INVALID_VALUE };

export class LoginResponseDto {
  @Type(() => User)
  user: User;

  @IsString(commonErrorMessage)
  token: string;
}
