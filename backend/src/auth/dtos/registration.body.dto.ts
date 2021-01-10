import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';
import {
  ERRORS,
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  USER_GENDER,
} from '@libs/constants';
import { Transform } from 'class-transformer';
import { transformPhoneNumber } from '@libs/helpers';

const phoneErrorMessage = { message: ERRORS.INVALID_PHONE_NUMBER };
const commonErrorMessage = { message: ERRORS.INVALID_VALUE };

export class RegistrationBodyDto {
  @IsString(commonErrorMessage)
  @Length(2, MAX_NAME_LENGTH, commonErrorMessage)
  @Transform((value) => value.trim())
  name: string;

  @IsEmail({}, commonErrorMessage)
  email: string;

  @IsString(phoneErrorMessage)
  @IsMobilePhone('be-BY', {}, commonErrorMessage)
  @Transform(transformPhoneNumber)
  phone: string;

  @IsOptional()
  @IsString(commonErrorMessage)
  @IsEnum(USER_GENDER, commonErrorMessage)
  gender: USER_GENDER;

  @IsString(commonErrorMessage)
  @MinLength(MIN_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_SHORT })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_LONG })
  password: string;
}
