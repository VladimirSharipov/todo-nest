import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { REGEX, MESSAGES } from '../../util';

export class AuthDTO {
  @ApiProperty({ example: 'example@example.com' })
  @IsNotEmpty()
  @MinLength(+MESSAGES.EMAIL_RULE_MESSAGE_LENGTH, {
    message: MESSAGES.EMAIL_RULE_MESSAGE,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Пример пароля 1234' })
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  @IsString()
  readonly password: string;
}
