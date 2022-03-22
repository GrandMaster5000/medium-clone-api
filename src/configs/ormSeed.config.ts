import { ConnectionOptions } from 'typeorm';
import getOrmConfig from './orm.config';

const getOrmSeedConfig: ConnectionOptions = {
	...getOrmConfig,
	migrations: ['src/seeds/**/*{.ts,.js}'],
	cli: {
		migrationsDir: 'src/seeds',
	},
};

export default getOrmSeedConfig;
