import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

import * as Entities from './entities';

export const buildDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => {
  const DB_USERNAME = configService.get<string>('DB_USERNAME');
  const DB_PASSWORD = encodeURIComponent(
    configService.get<string>('DB_PASSWORD')!,
  );
  const DB_HOSTS = configService.get<string>('DB_HOST')!.split(',');

  const MASTER_HOST = DB_HOSTS[0];
  const SLAVE_HOSTS = DB_HOSTS.slice(1);
  const DB_DATABASE = configService.get<string>('DB_DATABASE');

  return {
    type: 'postgres',
    replication: {
      master: {
        url: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${MASTER_HOST}/${DB_DATABASE}`,
      },
      slaves: SLAVE_HOSTS.map((host) => {
        return {
          url: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${host}/${DB_DATABASE}`,
        };
      }),
    },
    logging: configService.get('NODE_ENV') === 'development' ? 'all' : false,
    entities: [...Object.values(Entities)],
    migrationsRun: true,
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
  };
};
