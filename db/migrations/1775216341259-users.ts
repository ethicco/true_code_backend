import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1775216341259 implements MigrationInterface {
  name?: string | undefined;
  transaction?: boolean | undefined;
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'avatar',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'birthday',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'about',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'email',
            isUnique: true,
            isNullable: false,
            type: 'varchar(255)',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '32',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
