import { z } from 'zod';

const AuthorEntitySchema = z.object({
  username: z.string(),
  email: z.string().optional(),
  bio: z.string(),
  image: z.string(),
  following: z.boolean(),
});

export const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.string().array(),
  createdAt: z.string(),
  updatedAt: z.string(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: AuthorEntitySchema, // Use the Author entity schema
});

export const ArticlesSchema = z.object({
  articles: z.record(z.string(), ArticleSchema),
  articlesCount: z.number(),
});

export const FilterQuerySchema = z.object({
  page: z.coerce.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
    message: 'Page must be a positive number',
  }),
  source: z.enum(['user', 'global']),
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
});
