import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticelDto } from './dto/updateArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import { IArticlesResponse } from './types/articlesResponse.interface';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	async getArticles(
		@User('id') currentUserId: number,
		@Query() query: any,
	): Promise<IArticlesResponse> {
		return this.articlesService.findAll(currentUserId, query);
	}

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

	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string,
	): Promise<DeleteResult> {
		return this.articlesService.deleteBySlugArticle(slug, currentUserId);
	}

	@Put(':slug')
	@UseGuards(AuthGuard)
	async updateArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string,
		@Body('article') updateArticle: UpdateArticelDto,
	): Promise<IArticleResponse> {
		const updatedArticle = await this.articlesService.updateBySlugArticle(
			slug,
			updateArticle,
			currentUserId,
		);
		return this.articlesService.buildArticleResponse(updatedArticle);
	}

	@Post(':slug/favorite')
	@UseGuards(AuthGuard)
	async favorited(
		@User('id') currentUserId: number,
		@Param('slug') slug: string,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.articleFavorited(slug, currentUserId);
		return this.articlesService.buildArticleResponse(article);
	}

	@Delete(':slug/favorite')
	@UseGuards(AuthGuard)
	async unFavorited(
		@User('id') currentUserId: number,
		@Param('slug') slug: string,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.articleUnFavorited(slug, currentUserId);
		return this.articlesService.buildArticleResponse(article);
	}

	@Get('feed')
	@UseGuards(AuthGuard)
	async getFeed(
		@User('id') currentUserId: number,
		@Query() query: any,
	): Promise<IArticlesResponse> {
		return this.articlesService.getFeed(currentUserId, query);
	}
}
