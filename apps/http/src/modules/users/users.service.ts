import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { UsersRepository } from './users.repository';
import { CreateUserRequest, UserResponse } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(
    data: Omit<CreateUserRequest, 'avatar'>,
    avatar: Express.Multer.File,
  ): Promise<UserResponse> {
    const user = await this.usersRepository.create({
      ...data,
      avatar: '',
    });

    const userDir = path.join(process.cwd(), 'public', 'avatars', user.id);
    await fs.mkdir(userDir, { recursive: true });

    const newFilePath = path.join(userDir, avatar.filename);
    await fs.rename(avatar.path, newFilePath);

    const avatarUrl = `avatars/${user.id}/${avatar.filename}`;

    return this.usersRepository.update(user.id, { avatar: avatarUrl });
  }

  getByEmail(email: string): Promise<UserResponse> {
    return this.usersRepository.getByEmail(email);
  }

  updateProfile(
    id: string,
    data: Omit<CreateUserRequest, 'avatar'>,
  ): Promise<UserResponse> {
    return this.usersRepository.update(id, data);
  }

  updataAvatar(id: string, image: Express.Multer.File) {}
}
