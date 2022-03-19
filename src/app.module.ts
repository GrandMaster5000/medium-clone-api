import { Module } from '@nestjs/common';
import { TagsModule } from '@app/tags/tags.module';
import { ormConfig } from '@app/config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forRoot(ormConfig), TagsModule],
})
export class AppModule {}
