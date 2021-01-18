import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Length,
} from 'class-validator';
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  ERRORS,
  USER_GENDER,
} from '@libs/constants';
import { transformPhoneNumber } from '@libs/helpers';

const phoneErrorMessage = { message: ERRORS.INVALID_PHONE_NUMBER };
const commonErrorMessage = { message: ERRORS.INVALID_VALUE };

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString(commonErrorMessage)
  @Length(2, MAX_NAME_LENGTH, commonErrorMessage)
  @Transform((value) => value.trim())
  @Column()
  name: string;

  @IsEmail({}, commonErrorMessage)
  @Column()
  email: string;

  @IsString(phoneErrorMessage)
  @IsMobilePhone('be-BY', {}, commonErrorMessage)
  @Transform(transformPhoneNumber)
  @Column({ nullable: true })
  phone: string;

  @IsOptional()
  @IsString(commonErrorMessage)
  @IsEnum(USER_GENDER, commonErrorMessage)
  @Column({ type: 'enum', enum: USER_GENDER, nullable: true })
  gender: USER_GENDER;

  @Exclude()
  @IsString(commonErrorMessage)
  @MinLength(MIN_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_SHORT })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_LONG })
  @Column()
  password: string;

  @Exclude()
  @Column({ default: false })
  confirm_email: boolean;

  @Exclude()
  @Column({ default: false })
  confirm_member: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  constructor(object: Partial<User>) {
    Object.assign(this, object);
  }
}
