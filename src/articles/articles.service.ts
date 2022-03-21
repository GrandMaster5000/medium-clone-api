import { UserEntity } from '@app/user/user.entity';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './articles.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { ARTICLES_DOES_NOT_EXIST, YOU_NOT_AUTHOR } from './articles.constants';

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

	async deleteBySlugArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new NotFoundException(ARTICLES_DOES_NOT_EXIST);
		}

		if (article.author.id !== currentUserId) {
			throw new ForbiddenException(YOU_NOT_AUTHOR);
		}
		return this.articleRepository.delete({ slug });
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
