import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './articles.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
	) {}

	async createArticle(
		currentUser: UserEntity,
		createArticle: CreateArticleDto,
	): Promise<ArticleEntity> {
		const article = new ArticleEntity();
		Object.assign(article, createArticle);

		if (!article.tagList) {
			article.tagList = [];
		}

		article.slug = this.getSlug(createArticle.title);
		article.author = currentUser;

		return this.articleRepository.save(article);
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		return this.articleRepository.findOne({ slug });
	}

	buildArticleResponse(article: ArticleEntity): IArticleResponse {
		return { article };
	}

	private getSlug(title: string): string {
		return (
			slugify(title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
		);
		// Generate random string ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
	}
}
