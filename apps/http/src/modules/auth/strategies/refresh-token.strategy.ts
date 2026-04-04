import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from './types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_AUTH_REFRESH_SECRET')!,
    });
  }

  validate(payload: JwtPayload): {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    birthday: string;
    about: string;
    email: string;
    phone: string;
    iat: number;
    exp: number;
  } {
    return {
      id: payload.sub,
      avatar: payload.avatar,
      firstName: payload.firstName,
      lastName: payload.lastName,
      birthday: payload.birthday,
      about: payload.about,
      email: payload.email,
      phone: payload.phone,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
