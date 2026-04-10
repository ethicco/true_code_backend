import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { AuthRepository } from './auth.repository';
import { IAuthResponse, ISignUpRequest } from './dto';
import { settings } from '@/common/settings';
import { generateHashPassword, verifyPassword } from './helpers';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../users/users.repository';
import { IGetTokensParams } from './interfaces';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IUser } from '@/common/interfaces';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    dto: Omit<ISignUpRequest, 'avatar'>,
    avatar: Express.Multer.File,
    response: Response,
  ): Promise<ReturnType<Response['send']>> {
    const { password, ...params } = dto;

    const user = await this.userRepository.getByEmail(params.email);

    if (user) {
      await fs.rm(
        path.join(
          process.cwd(),
          settings.UPLOAD_FOLDER,
          'avatars',
          avatar.filename,
        ),
        { force: true },
      );

      throw new BadRequestException('Such user already existed');
    }

    const passwordHash = await generateHashPassword(password);

    const createdUser = await this.authRepository.create({
      ...dto,
      passwordHash,
      avatar: '',
    });

    const userDir = path.join(
      process.cwd(),
      settings.UPLOAD_FOLDER,
      'avatars',
      createdUser.id,
    );
    await fs.mkdir(userDir, { recursive: true });

    const newFilePath = path.join(userDir, avatar.filename);
    await fs.rename(avatar.path, newFilePath);

    const avatarUrl = `avatars/${createdUser.id}/${avatar.filename}`;

    const res = await this.userRepository.update(createdUser.id, {
      avatar: avatarUrl,
    });

    const { accessToken, refreshToken } = await this.updateTokens({
      userId: res.id,
      avatar: res.avatar,
      firstName: res.firstName,
      lastName: res.lastName,
      birthday: res.birthday,
      about: res.about,
      email: res.email,
      phone: res.phone,
    });

    if (!accessToken || !refreshToken) {
      throw new ForbiddenException();
    }

    this.setCookie(accessToken, refreshToken, response);

    return response.send({ message: 'Sign Up successfully' });
  }

  async signIn(
    email: string,
    password: string,
    response: Response,
  ): Promise<ReturnType<Response['send']>> {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new BadRequestException('User is not registered');
    }

    const isVerifiedPassword = await verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isVerifiedPassword) {
      throw new BadRequestException('User password is wrong');
    }

    const { accessToken, refreshToken } = await this.updateTokens({
      userId: user.id,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: user.birthday,
      about: user.about,
      email: user.email,
      phone: user.phone,
    });

    if (!accessToken || !refreshToken) {
      throw new ForbiddenException();
    }

    this.setCookie(accessToken, refreshToken, response);

    return response.send({ message: 'Logged in successfully' });
  }

  signOut(_req: Request, res: Response): ReturnType<Response['send']> {
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return res.send({ message: 'Logged out successfully' });
  }

  async refreshToken(
    user: IUser,
    response: Response,
  ): Promise<ReturnType<Response['send']>> {
    const { accessToken, refreshToken } = await this.updateTokens({
      userId: user.id,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: user.birthday as unknown as Date,
      about: user.about,
      email: user.email,
      phone: user.phone,
    });

    if (!accessToken || !refreshToken) {
      throw new ForbiddenException();
    }

    this.setCookie(accessToken, refreshToken, response);

    return response.send({
      message: 'Refresh token has been updated successfully',
    });
  }

  private async getTokens(
    params: IGetTokensParams,
    secret: string,
    expiresIn: JwtSignOptions['expiresIn'],
  ): Promise<IAuthResponse> {
    const { userId, ...otherParams } = params;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        ...otherParams,
      }),
      this.jwtService.signAsync(
        {
          sub: userId,
          ...otherParams,
        },
        {
          secret,
          expiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private updateTokens(params: IGetTokensParams): Promise<IAuthResponse> {
    return this.getTokens(
      params,
      this.configService.get<string>('JWT_AUTH_REFRESH_SECRET')!,
      this.configService.get('JWT_AUTH_EXPIRES_IN_REFRESH'),
    );
  }

  private setCookie(
    accessToken: string,
    refreshToken: string,
    response: Response,
  ) {
    const dateAccessToken = new Date();
    let timeAccessToken = dateAccessToken.getTime();
    timeAccessToken += 900 * 1000;
    dateAccessToken.setTime(timeAccessToken);

    const dateRefreshToken = new Date();
    let timeRefreshToken = dateRefreshToken.getTime();
    timeRefreshToken += 3600 * 1000 * 24;
    dateRefreshToken.setTime(timeRefreshToken);

    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('accessToken', accessToken, {
      expires: dateAccessToken,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      path: '/',
    });

    response.cookie('refreshToken', refreshToken, {
      expires: dateRefreshToken,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      path: '/',
    });
  }
}
