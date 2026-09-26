import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../db/store';
import { AuthenticatedRequest } from '../middlewares/auth';
import { Article, Comment } from '../types';

export const articleController = {
  async getArticles(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const category = req.query.category as string;
    const author = req.query.author as string;
    const format = req.query.format as string;
    const tag = req.query.tag as string;

    memoryStore.hydrateRelations();
    let filtered = memoryStore.articles.filter(a => a.status === 'PUBLISHED');

    if (category) {
      filtered = filtered.filter(a => a.category?.slug === category || a.category_id === category);
    }
    if (author) {
      filtered = filtered.filter(a => a.author?.username === author || a.author_id === author);
    }
    if (format) {
      filtered = filtered.filter(a => a.match_format.toLowerCase() === format.toLowerCase());
    }
    if (tag) {
      filtered = filtered.filter(a => a.tags?.some(t => t.slug === tag || t.name.toLowerCase() === tag.toLowerCase()));
    }

    // Sort by publication date desc
    filtered.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    res.json({
      success: true,
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  },

  async getBreaking(req: Request, res: Response): Promise<void> {
    memoryStore.hydrateRelations();
    const breaking = memoryStore.articles
      .filter(a => a.status === 'PUBLISHED' && a.is_breaking)
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
      .slice(0, 5);

    res.json({
      success: true,
      data: breaking,
    });
  },

  async getFeatured(req: Request, res: Response): Promise<void> {
    memoryStore.hydrateRelations();
    const featured = memoryStore.articles
      .filter(a => a.status === 'PUBLISHED' && a.is_featured)
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
      .slice(0, 4);

    res.json({
      success: true,
      data: featured,
    });
  },

  async getBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;
    memoryStore.hydrateRelations();

    const article = memoryStore.articles.find(a => a.slug === slug);
    if (!article) {
      res.status(404).json({ success: false, error: 'Cricket article not found' });
      return;
    }

    // Increment view count
    article.views_count = (Number(article.views_count) || 0) + 1;

    // Fetch related articles (same category or format, excluding current)
    const related = memoryStore.articles
      .filter(a => a.id !== article.id && a.status === 'PUBLISHED' && (a.category_id === article.category_id || a.match_format === article.match_format))
      .slice(0, 3);

    // Fetch comments for this article
    const comments = memoryStore.comments
      .filter(c => c.article_id === article.id && c.status === 'APPROVED')
      .map(c => {
        const commenter = memoryStore.users.find(u => u.id === c.user_id);
        return {
          ...c,
          user: commenter ? {
            id: commenter.id,
            full_name: commenter.full_name,
            username: commenter.username,
            avatar_url: commenter.avatar_url,
          } : undefined,
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({
      success: true,
      data: {
        article,
        related,
        comments,
      },
    });
  },

  async createArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      featured_image_url,
      category_id,
      match_format,
      is_breaking,
      is_featured,
      status,
      author_id,
    } = req.body;

    if (!title || !content || !category_id) {
      res.status(400).json({ success: false, error: 'Title, content, and category are required' });
      return;
    }

    const slug = (customSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) + '-' + Math.floor(1000 + Math.random() * 9000);
    const read_time_minutes = Math.max(1, Math.round(content.split(/\s+/).length / 200));

    const newArticle: Article = {
      id: uuidv4(),
      title,
      slug,
      excerpt: excerpt || content.substring(0, 160) + '...',
      content,
      featured_image_url: featured_image_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
      author_id: author_id || req.user?.id || 'user-admin',
      category_id,
      status: status || 'PUBLISHED',
      match_format: match_format || 'GENERAL',
      is_breaking: Boolean(is_breaking),
      is_featured: Boolean(is_featured),
      read_time_minutes,
      views_count: 0,
      published_at: (status === 'PUBLISHED' || !status) ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.articles.unshift(newArticle);
    memoryStore.hydrateRelations();

    res.status(201).json({
      success: true,
      data: newArticle,
    });
  },

  async updateArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const article = memoryStore.articles.find(a => a.id === id);

    if (!article) {
      res.status(404).json({ success: false, error: 'Article not found' });
      return;
    }

    const {
      title,
      excerpt,
      content,
      featured_image_url,
      category_id,
      match_format,
      is_breaking,
      is_featured,
      status,
    } = req.body;

    if (title) article.title = title;
    if (excerpt) article.excerpt = excerpt;
    if (content) {
      article.content = content;
      article.read_time_minutes = Math.max(1, Math.round(content.split(/\s+/).length / 200));
    }
    if (featured_image_url) article.featured_image_url = featured_image_url;
    if (category_id) article.category_id = category_id;
    if (match_format) article.match_format = match_format;
    if (typeof is_breaking === 'boolean') article.is_breaking = is_breaking;
    if (typeof is_featured === 'boolean') article.is_featured = is_featured;
    if (status) {
      article.status = status;
      if (status === 'PUBLISHED' && !article.published_at) {
        article.published_at = new Date().toISOString();
      }
    }
    article.updated_at = new Date().toISOString();

    memoryStore.hydrateRelations();

    res.json({
      success: true,
      data: article,
    });
  },

  async deleteArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const index = memoryStore.articles.findIndex(a => a.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, error: 'Article not found' });
      return;
    }

    memoryStore.articles.splice(index, 1);
    res.json({ success: true, message: 'Article deleted successfully' });
  },

  async addComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { content, author_name } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, error: 'Comment content cannot be empty' });
      return;
    }

    const article = memoryStore.articles.find(a => a.id === id);
    if (!article) {
      res.status(404).json({ success: false, error: 'Article not found' });
      return;
    }

    const commenterName = req.user
      ? (memoryStore.users.find(u => u.id === req.user?.id)?.full_name || req.user.username)
      : (author_name?.trim() || 'Cricket Fan');

    const newComment: Comment = {
      id: uuidv4(),
      article_id: article.id,
      user_id: req.user?.id || 'guest-reader',
      content: content.trim(),
      status: 'APPROVED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: req.user?.id || 'guest-reader',
        full_name: commenterName,
        username: commenterName.toLowerCase().replace(/\s+/g, '_'),
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(commenterName)}`,
      },
    };

    memoryStore.comments.push(newComment);

    res.status(201).json({
      success: true,
      data: newComment,
    });
  },
};
