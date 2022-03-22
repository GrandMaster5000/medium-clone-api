import { ArticleEntity } from '../articles.entity';

export interface IArticlesResponse {
	articles: ArticleEntity[];
	articlesCount: number;
}
