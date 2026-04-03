import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity({ name: 'post_image ' })
export class PostImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id', type: 'uuid', nullable: false })
  postId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  image: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  cratedAt: Date;

  @ManyToOne(() => PostEntity, (post) => post.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', foreignKeyConstraintName: 'fk_post_id' })
  post: PostEntity;
}
