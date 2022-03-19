import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
	constructor(
		@InjectRepository(TagEntity)
		private readonly tagRepository: Repository<TagEntity>,
	) {}
	async findAll(): Promise<{ tags: string[] }> {
		const tags = await this.tagRepository.find();
		return {
			tags: tags.map((tag) => tag.name),
		};
	}
}
