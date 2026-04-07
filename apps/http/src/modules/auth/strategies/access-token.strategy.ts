import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from './types';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJWT,
      ]),
      secretOrKey: configService.get<string>('JWT_AUTH_SECRET')!,
      ignoreExpiration: false,
    });
  }

  private static extractJWT(req: Request) {
    if (req.cookies && 'accessToken' in req.cookies) {
      return req.cookies.accessToken;
    }

    return null;
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
