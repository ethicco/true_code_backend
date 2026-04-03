import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Injectable } from '@nestjs/common';

import { AuthRepository } from './auth.repository';
import { AuthResponse, ISignUpRequest } from './dto';
import { settings } from '@/common/settings';
import { generateHashPassword } from './helpers';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../users/users.repository';
import { IGetTokensParams } from './interfaces';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    request: Omit<ISignUpRequest, 'avatar'>,
    avatar: Express.Multer.File,
  ): Promise<AuthResponse> {
    const { password, ...params } = request;

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
    }

    const passwordHash = await generateHashPassword(
      password,
      this.configService.get<string>('SALT_CREATE_PASSWORD')!,
    );

    const createdUser = await this.authRepository.create({
      ...request,
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

    return this.updateTokens({
      userId: res.id,
      avatar: res.avatar,
      firstName: res.firstName,
      lastName: res.lastName,
      about: res.about,
      email: res.email,
      phone: res.phone,
    });
  }

  private async getTokens(
    params: IGetTokensParams,
    secret: string,
    expiresIn: JwtSignOptions['expiresIn'],
  ): Promise<AuthResponse> {
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

  private updateTokens(params: IGetTokensParams): Promise<AuthResponse> {
    return this.getTokens(
      params,
      this.configService.get<string>('JWT_AUTH_REFRESH_SECRET')!,
      this.configService.get('JWT_AUTH_EXPIRES_IN_REFRESH'),
    );
  }
}
