import type {
  ArticlesDto as ApiArticlesDto,
  ArticleDto as ApiArticleDtoShape,
  FilterQueryDto,
} from '~shared/api/api.types';
import type { Article, Articles, FilterQuery } from './article.types';

type BackendArticleObject = ApiArticlesDto['articles'][number];

export function transformSingleBackendArticleToArticleEntity(backendArticle: BackendArticleObject): Article {
  return {
    slug: backendArticle.slug,
    title: backendArticle.title,
    description: backendArticle.description,
    body: backendArticle.body,
    tagList: backendArticle.tagList.filter(Boolean),
    createdAt: backendArticle.createdAt,
    updatedAt: backendArticle.updatedAt,
    favorited: backendArticle.favorited,
    favoritesCount: backendArticle.favoritesCount,
    author: {
      username: backendArticle.author.username,
      email: backendArticle.author.email,
      bio: backendArticle.author.bio || '',
      image: backendArticle.author.image || '',
      following: backendArticle.author.following || false,
    },
  };
}

export function transformArticleDtoToArticle(articleDto: ApiArticleDtoShape): Article {
  const backendArticle = articleDto.article;
  return transformSingleBackendArticleToArticleEntity(backendArticle);
}

export function transformArticlesDtoToArticles(articlesDto: ApiArticlesDto): Articles {
  const { articles, articlesCount } = articlesDto;

  return {
    articles: Object.fromEntries(
      articles.map((article) => [article.slug, transformSingleBackendArticleToArticleEntity(article)]),
    ),
    articlesCount,
  };
}

export function transformFilterQueryToFilterQueryDto(filterQuery: FilterQuery): FilterQueryDto {
  const { page, source, ...otherParams } = filterQuery;
  const limit = 10;
  const offset = (Number(page) - 1) * limit;

  return {
    ...otherParams,
    offset,
    limit,
  };
}
