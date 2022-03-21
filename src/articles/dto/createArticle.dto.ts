import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
	@IsNotEmpty()
	readonly title: string;

	@IsNotEmpty()
	readonly description: string;

	@IsNotEmpty()
	readonly body: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	readonly tagList: string[];
}
