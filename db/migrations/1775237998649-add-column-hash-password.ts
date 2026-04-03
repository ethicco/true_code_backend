import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnHashPassword1775237998649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'password_hash',
        type: 'varchar',
        length: '32',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'password_hash');
  }
}
