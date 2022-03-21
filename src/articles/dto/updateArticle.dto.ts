import { IsOptional, IsString } from 'class-validator';

export class UpdateArticelDto {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	body?: string;
}
