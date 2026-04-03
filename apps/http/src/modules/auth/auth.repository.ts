import { UserEntity } from '@/db/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISignUpRequest } from './dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  create(
    request: Omit<ISignUpRequest, 'password'> & { passwordHash: string },
  ): Promise<UserEntity> {
    return this.usersRepository.save(request);
  }
}
