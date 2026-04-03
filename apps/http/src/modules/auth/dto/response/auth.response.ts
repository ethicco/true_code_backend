import { ApiProperty } from '@nestjs/swagger';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthResponse implements IAuthResponse {
  @ApiProperty({
    description: 'Токен доступа.',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'Рефреш токен доступа.',
    type: String,
  })
  refreshToken: string;
}
