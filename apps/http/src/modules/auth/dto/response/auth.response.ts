import { ExposeApiProperty } from '@/common/decorators';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthResponse implements IAuthResponse {
  @ExposeApiProperty({
    description: 'Токен доступа.',
    type: String,
  })
  accessToken: string;

  @ExposeApiProperty({
    description: 'Рефреш токен доступа.',
    type: String,
  })
  refreshToken: string;
}
