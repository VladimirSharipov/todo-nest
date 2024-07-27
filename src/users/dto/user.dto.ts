import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { MESSAGES, REGEX } from 'src/util';

export class UserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'Password@123' })
  @IsOptional()
  @MinLength(5, { message: MESSAGES.EMAIL_RULE_MESSAGE })
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'Password@123' })
  @IsOptional()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  @IsString()
  readonly password?: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'admin' })
  @IsOptional()
  @IsString()
  readonly username?: string;
}
