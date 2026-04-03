import { UserEntity } from '@/db/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUpdateUserRequest } from './dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneOrFail({ where: { email } });
  }

  async update(id: string, request: IUpdateUserRequest): Promise<UserEntity> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });

    UserEntity.merge(user, { ...request });

    return this.userRepository.save(user);
  }
}
