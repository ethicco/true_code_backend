import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { buildDataSourceOptions } from './db/database.provider';

export default new DataSource(buildDataSourceOptions(new ConfigService()));
