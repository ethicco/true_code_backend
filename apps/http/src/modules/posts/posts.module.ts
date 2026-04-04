import { PostEntity, PostImageEntity } from '@/db/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository';
import { PostsImageRepository } from './posts-image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostImageEntity])],
  controllers: [],
  providers: [PostsRepository, PostsImageRepository],
})
export class PostsModule {}
