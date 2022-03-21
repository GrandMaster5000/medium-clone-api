import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Post()
	@UseGuards(AuthGuard)
	async create(
		@User() currentUser: UserEntity,
		@Body('article') createArticle: CreateArticleDto,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.createArticle(currentUser, createArticle);
		return this.articlesService.buildArticleResponse(article);
	}

	@Get(':slug')
	async getArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
		const article = await this.articlesService.findBySlug(slug);
		return this.articlesService.buildArticleResponse(article);
	}
}
