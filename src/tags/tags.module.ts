import { Module } from '@nestjs/common';
import { TagController } from './tags.controller';

@Module({
	controllers: [TagController],
})
export class TagModule {}
