import { Module } from '@nestjs/common';
import { TagsModule } from '@app/tags/tags.module';

@Module({
	imports: [TagsModule],
})
export class AppModule {}
