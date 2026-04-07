import { ExposeApiProperty } from '@/common/decorators';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthResponse {
  @ExposeApiProperty({
    description: 'Сообщение успешного действия.',
    type: String,
  })
  message: string;
}
