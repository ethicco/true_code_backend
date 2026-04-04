import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnHashPasswordUpdate1775300341449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'password_hash',
      new TableColumn({
        name: 'password_hash',
        type: 'varchar',
        length: '256',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'password_hash',
      new TableColumn({
        name: 'password_hash',
        type: 'varchar',
        length: '32',
        isNullable: false,
      }),
    );
  }
}
