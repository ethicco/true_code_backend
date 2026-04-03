import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export interface ISignUpRequest {
  avatar: string;
  firstName: string;
  lastName: string;
  password: string;
  birthday: Date;
  about: string;
  email: string;
  phone: string;
}

export class SignUpRequest implements ISignUpRequest {
  @ApiProperty({
    description: 'Аватар пользователя',
    type: String,
    format: 'binary',
  })
  avatar: string;

  @ApiProperty({ description: 'Имя пользователя.', type: String })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя.', type: String })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Пароль пользователя.', type: String })
  @Length(8, 32)
  password: string;

  @ApiProperty({
    description: 'Дата рождения пользователя.',
    type: Date,
    format: 'date',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  birthday: Date;

  @ApiProperty({ description: 'Информация о пользователе.', type: String })
  @IsString()
  about: string;

  @ApiProperty({
    description: 'Email пользователя.',
    type: String,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Телефон пользователя.', type: String })
  @IsPhoneNumber('RU')
  phone: string;
}
