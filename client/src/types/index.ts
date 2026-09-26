export type UserRole = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'READER';
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type MatchFormat = 'TEST' | 'ODI' | 'T20I' | 'IPL' | 'GENERAL';

export interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  articleCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author_id: string;
  category_id: string;
  status: ArticleStatus;
  match_format: MatchFormat;
  is_breaking: boolean;
  is_featured: boolean;
  read_time_minutes: number;
  views_count: number;
  published_at: string | null;
  created_at: string;
  author?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
    bio: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Tag[];
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  status: string;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    query?: string;
  };
}
