// File: src/shared/api/api.contracts.ts
import { z } from 'zod';

// Author schema for an author object within an article from the /articles list
const AuthorInArticleDtoSchema = z.object({
  username: z.string(),
  email: z.string().email().optional(), // Assuming email is optional and has email format
  bio: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  following: z.boolean().optional(),
});

// Article DTO Schema (for one article object, typically nested or in an array)
export const SingleArticleObjectDtoSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.string().array(),
  createdAt: z.string(), // Use the preprocessed schema
  updatedAt: z.string(), // Use the preprocessed schema
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: AuthorInArticleDtoSchema,
  comments: z.array(z.any()).optional(), // To allow the unexpected 'comments' array
});

// Schema for the { "article": { ... } } wrapper (for single article responses)
export const ArticleDtoSchema = z.object({
  article: SingleArticleObjectDtoSchema,
});

// Schema for the { "articles": [ ... ], "articlesCount": ... } wrapper (for multiple articles response)
export const ArticlesDtoSchema = z.object({
  articles: z.array(SingleArticleObjectDtoSchema), // Array of the plain article objects
  articlesCount: z.number(),
});

// --- Other DTOs (FilterQueryDtoSchema, CreateArticleDtoSchema, etc.) ---
export const FilterQueryDtoSchema = z.object({
  offset: z.number().min(0),
  limit: z.number().min(1),
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
});

export const CreateArticleDtoSchema = z.object({
  article: z.object({
    // Matches SingleArticleObjectDtoSchema structure generally, but for creation
    title: z.string().min(1),
    description: z.string().min(1),
    body: z.string().min(1),
    tagList: z.optional(z.string().array()),
  }),
});

export const UpdateArticleDtoSchema = z.object({
  article: z.object({
    // Similar to CreateArticleDtoSchema, but all fields optional
    title: z.string().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
    tagList: z.optional(z.string().array()),
  }),
});

// Author schema for a comment's author - assuming this might be more complete
// or could also use a specific "AuthorForCommentDtoSchema" if different
const AuthorForCommentDtoSchema = z.object({
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string(), // Note: original was z.string().nullable() - check BE for image in comment author
  following: z.boolean(),
});

export const CommentDtoSchema = z.object({
  comment: z.object({
    id: z.number(),
    createdAt: z.string(), // Use preprocessed for consistency if format is same
    updatedAt: z.string(), // Use preprocessed for consistency
    body: z.string(),
    author: AuthorForCommentDtoSchema,
  }),
});

export const CommentsDtoSchema = z.object({
  comments: z.array(CommentDtoSchema.shape.comment),
});

export const CreateCommentDtoSchema = z.object({
  comment: z.object({
    body: z.string().min(1),
  }),
});

// This ProfileDtoSchema is for the /profiles/{username} endpoint
// and should represent the complete author profile structure.
export const ProfileDtoSchema = z.object({
  profile: z.object({
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    following: z.boolean(), // This 'following' is specific to the viewing user
  }),
});

export const UserDtoSchema = z.object({
  user: z.object({
    email: z.string(),
    token: z.string(),
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
  }),
});

export const LoginUserDtoSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const RegisterUserDtoSchema = z.object({
  user: z.object({
    username: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const UpdateUserDtoSchema = z.object({
  user: z
    .object({
      email: z.string().email().optional().or(z.literal('')),
      username: z.string().min(5).optional().or(z.literal('')),
      bio: z.string().optional().or(z.literal('')),
      image: z.string().optional().or(z.literal('')),
      password: z.string().min(8).optional().or(z.literal('')),
    })
    .partial()
    .refine((args) => Object.values(args).some(Boolean), {
      path: ['root'],
      message: 'One of the fields must be defined',
    }),
});

export const TagsDtoSchema = z.object({ tags: z.array(z.string()) });

export const ApiErrorDataDtoSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
});

export const ApiErrorDataSchema = z.array(z.string());
