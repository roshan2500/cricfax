export type UserRole = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'READER';

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

export type MatchFormat = 'TEST' | 'ODI' | 'T20I' | 'IPL' | 'GENERAL';

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
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
  updated_at: string;
  
  // Joined fields
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
  parent_id?: string | null;
  content: string;
  status: 'APPROVED' | 'PENDING' | 'SPAM';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
