import { Module } from '@nestjs/common';
import { TagsModule } from '@app/tags/tags.module';
import getOrmConfig from '@app/configs/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
	imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(getOrmConfig), TagsModule, UserModule],
})
export class AppModule {}
