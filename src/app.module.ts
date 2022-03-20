import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TagsModule } from '@app/tags/tags.module';
import getOrmConfig from '@app/configs/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@app/user/user.module';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';

@Module({
	imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(getOrmConfig), TagsModule, UserModule],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AuthMiddleware).forRoutes({
			path: '*',
			method: RequestMethod.ALL,
		});
	}
}
