import { Article, Category, User, Comment, ApiResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('cp_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || `HTTP ${response.status}: Request failed`);
  }

  return json;
}

export const api = {
  // Articles
  getArticles(params?: { category?: string; author?: string; format?: string; tag?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.author) query.set('author', params.author);
    if (params?.format) query.set('format', params.format);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    return request<ApiResponse<Article[]>>(`/articles?${query.toString()}`);
  },

  getBreaking() {
    return request<ApiResponse<Article[]>>('/articles/breaking');
  },

  getFeatured() {
    return request<ApiResponse<Article[]>>('/articles/featured');
  },

  getArticleBySlug(slug: string) {
    return request<ApiResponse<{ article: Article; related: Article[]; comments: Comment[] }>>(`/articles/${slug}`);
  },

  createArticle(data: Partial<Article>) {
    return request<ApiResponse<Article>>('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateArticle(id: string, data: Partial<Article>) {
    return request<ApiResponse<Article>>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteArticle(id: string) {
    return request<ApiResponse<void>>(`/articles/${id}`, {
      method: 'DELETE',
    });
  },

  addComment(articleId: string, content: string, authorName?: string) {
    return request<ApiResponse<Comment>>(`/articles/${articleId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, author_name: authorName }),
    });
  },

  // Categories
  getCategories() {
    return request<ApiResponse<Category[]>>('/categories');
  },

  getCategoryBySlug(slug: string) {
    return request<ApiResponse<{ category: Category; articles: Article[] }>>(`/categories/${slug}`);
  },

  // Search
  search(q: string, format?: string, category?: string) {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    if (format) query.set('format', format);
    if (category) query.set('category', category);
    return request<ApiResponse<Article[]>>(`/search?${query.toString()}`);
  },

  // Authors
  getAuthor(username: string) {
    return request<ApiResponse<{ author: User & { totalArticles: number; totalViews: number }; articles: Article[] }>>(`/authors/${username}`);
  },

  // Admin
  getAdminStats() {
    return request<ApiResponse<{
      totalArticles: number;
      publishedArticles: number;
      draftArticles: number;
      totalViews: number;
      totalUsers: number;
      totalAuthors: number;
      totalComments: number;
    }>>('/admin/stats');
  },

  getAdminArticles() {
    return request<ApiResponse<Article[]>>('/admin/articles');
  },

  updateArticleStatus(id: string, status: string) {
    return request<ApiResponse<Article>>(`/admin/articles/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getAdminUsers() {
    return request<ApiResponse<User[]>>('/admin/users');
  },

  updateUserRole(id: string, role: string) {
    return request<ApiResponse<User>>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  // Auth
  login(email: string, password: string) {
    return request<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register(data: { email: string; password: string; full_name: string; username: string }) {
    return request<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe() {
    return request<ApiResponse<User>>('/auth/me');
  },

  logout() {
    return request<{ success: boolean }>('/auth/logout', { method: 'POST' });
  },
};
