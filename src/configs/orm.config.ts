import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

export const getOrmConfig = (configService: ConfigService): ConnectionOptions => {
	return {
		type: 'postgres',
		host: configService.get('DATABASE_HOST'),
		port: configService.get('DATABASE_PORT'),
		username: configService.get('DATABASE_USERNAME'),
		password: configService.get('DATABASE_PASSWORD'),
		database: configService.get('DATABASE_NAME'),
		entities: [__dirname + '/**/*.entity{.ts,.js}'],
		synchronize: true,
	};
};
