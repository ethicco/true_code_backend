import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { IUpdateUserRequest, UserResponse } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getById(id: string): Promise<UserResponse> {
    return this.usersRepository.getById(id);
  }

  updateProfile(id: string, dto: IUpdateUserRequest): Promise<UserResponse> {
    return this.usersRepository.update(id, dto);
  }

  updataAvatar(id: string, avatar: Express.Multer.File) {
    const avatarUrl = `avatars/${id}/${avatar.filename}`;

    return this.usersRepository.update(id, { avatar: avatarUrl });
  }
}
