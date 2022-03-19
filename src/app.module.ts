import { Module } from '@nestjs/common';
import { TagsModule } from './tags/tags.module';

@Module({
	imports: [TagsModule],
})
export class AppModule {}
