import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class SignInRequest {
  @ApiProperty({
    description: 'Email пользователя.',
    type: String,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя.', type: String })
  @Length(8, 32)
  password: string;
}
