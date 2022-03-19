import { ConnectionOptions } from 'typeorm';

export const ormConfig: ConnectionOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'mediumclone',
	password: 'prorok28719',
	database: 'mediumclone',
};
