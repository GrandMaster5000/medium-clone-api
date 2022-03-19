import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Get()
	async findAll(): Promise<{ tags: string[] }> {
		return this.tagsService.findAll();
	}
}
