import { PostEntity, PostImageEntity } from '@/db/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository';
import { PostsImageRepository } from './posts-image.repository';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostImageEntity])],
  controllers: [PostsController],
  providers: [PostsRepository, PostsImageRepository, PostsService],
})
export class PostsModule {}
