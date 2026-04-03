import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddConstraints1775218439356 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'post',
      new TableForeignKey({
        name: 'fk_user_id',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'post_image',
      new TableForeignKey({
        name: 'fk_post_id',
        columnNames: ['post_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('post', 'fk_user_id');
    await queryRunner.dropForeignKey('post_image', 'fk_post_id');
  }
}
