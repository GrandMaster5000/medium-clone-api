import { UserEntity } from '@app/user/user.entity';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { ArticleEntity } from './articles.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { ARTICLES_DOES_NOT_EXIST, YOU_NOT_AUTHOR } from './articles.constants';
import { UpdateArticelDto } from './dto/updateArticle.dto';
import { IArticlesResponse } from './types/articlesResponse.interface';
import { FollowEntity } from '@app/profiles/follow.etntity';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
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

	async findAll(currentUserId: number, query: any): Promise<IArticlesResponse> {
		const queryBuilder = getRepository(ArticleEntity)
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author');

		queryBuilder.orderBy('articles.createdAt', 'DESC');

		const articlesCount = await queryBuilder.getCount();

		if (query.favorited) {
			const author = await this.userRepository.findOne(
				{
					username: query.favorited,
				},
				{ relations: ['favorites'] },
			);
			const ids = author.favorites.map((el) => el.id);
			if (ids.length > 0) {
				queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids });
			} else {
				queryBuilder.andWhere('1=0');
			}
		}

		if (query.tag) {
			queryBuilder.andWhere('articles.tagList LIKE :tag', {
				tag: `%${query.tag}%`,
			});
		}

		if (query.author) {
			const author = await this.userRepository.findOne({
				username: query.author,
			});
			queryBuilder.andWhere('articles.authorId = :id', {
				id: author.id,
			});
		}

		if (query.limit) {
			queryBuilder.limit(query.limit);
		}

		if (query.offset) {
			queryBuilder.offset(query.offset);
		}

		let favoriteIds: number[] = [];

		if (currentUserId) {
			const currentUser = await this.userRepository.findOne(currentUserId, {
				relations: ['favorites'],
			});
			favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
		}

		const articles = await queryBuilder.getMany();
		const articlesWithFavorites = articles.map((article) => {
			const favorited = favoriteIds.includes(article.id);
			return { ...article, favorited };
		});
		return { articles: articlesWithFavorites, articlesCount };
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

	async updateBySlugArticle(
		slug: string,
		updateArticle: UpdateArticelDto,
		currentUserId: number,
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new NotFoundException(ARTICLES_DOES_NOT_EXIST);
		}

		if (article.author.id !== currentUserId) {
			throw new ForbiddenException(YOU_NOT_AUTHOR);
		}

		Object.assign(article, updateArticle);
		return this.articleRepository.save(article);
	}

	async articleFavorited(slug: string, currentUserId: number): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);
		const user = await this.userRepository.findOne(currentUserId, {
			relations: ['favorites'],
		});
		const isNotFavorited =
			user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id) === -1;

		if (isNotFavorited) {
			user.favorites.push(article);
			article.favoritesCount++;
			await this.userRepository.save(user);
			await this.articleRepository.save(article);
		}
		return article;
	}

	async articleUnFavorited(slug: string, currentUserId: number): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);
		const user = await this.userRepository.findOne(currentUserId, {
			relations: ['favorites'],
		});
		const articleIndex = user.favorites.findIndex(
			(articleInFavorites) => articleInFavorites.id === article.id,
		);

		if (articleIndex >= 0) {
			user.favorites.splice(articleIndex, 1);
			article.favoritesCount--;
			await this.userRepository.save(user);
			await this.articleRepository.save(article);
		}
		return article;
	}

	async getFeed(currentUserId: number, query: any): Promise<IArticlesResponse> {
		const follows = await this.followRepository.find({ followerId: currentUserId });

		if (follows.length === 0) {
			return { articles: [], articlesCount: 0 };
		}
		const followingUserIds = follows.map((follow) => follow.followingId);
		const queryBuilder = getRepository(ArticleEntity)
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')
			.where('articles.authorId IN (:...ids)', { ids: followingUserIds });

		queryBuilder.orderBy('articles.createdAt', 'DESC');

		const articlesCount = await queryBuilder.getCount();

		if (query.limit) {
			queryBuilder.limit(query.limit);
		}

		if (query.offset) {
			queryBuilder.offset(query.offset);
		}

		const articles = await queryBuilder.getMany();

		return { articles, articlesCount };
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
