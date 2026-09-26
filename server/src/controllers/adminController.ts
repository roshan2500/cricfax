import { Response } from 'express';
import { memoryStore } from '../db/store';
import { AuthenticatedRequest } from '../middlewares/auth';
import { UserRole, ArticleStatus } from '../types';

export const adminController = {
  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    const totalArticles = memoryStore.articles.length;
    const publishedArticles = memoryStore.articles.filter(a => a.status === 'PUBLISHED').length;
    const draftArticles = memoryStore.articles.filter(a => a.status === 'DRAFT').length;
    const totalViews = memoryStore.articles.reduce((acc, a) => acc + (Number(a.views_count) || 0), 0);
    const totalUsers = memoryStore.users.length;
    const totalAuthors = memoryStore.users.filter(u => u.role === 'AUTHOR' || u.role === 'EDITOR').length;
    const totalComments = memoryStore.comments.length;

    res.json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalViews,
        totalUsers,
        totalAuthors,
        totalComments,
      },
    });
  },

  async getAllArticles(req: AuthenticatedRequest, res: Response): Promise<void> {
    memoryStore.hydrateRelations();
    const articles = [...memoryStore.articles].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    res.json({
      success: true,
      data: articles,
    });
  },

  async updateArticleStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: ArticleStatus[] = ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const article = memoryStore.articles.find(a => a.id === id);
    if (!article) {
      res.status(404).json({ success: false, error: 'Article not found' });
      return;
    }

    article.status = status;
    if (status === 'PUBLISHED' && !article.published_at) {
      article.published_at = new Date().toISOString();
    }
    article.updated_at = new Date().toISOString();

    res.json({
      success: true,
      data: article,
    });
  },

  async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    const users = memoryStore.users.map(({ password_hash: _, ...safeUser }) => safeUser);
    res.json({
      success: true,
      data: users,
    });
  },

  async updateUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles: UserRole[] = ['ADMIN', 'EDITOR', 'AUTHOR', 'READER'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ success: false, error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
      return;
    }

    const user = memoryStore.users.find(u => u.id === id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    user.role = role;
    user.updated_at = new Date().toISOString();

    const { password_hash: _, ...safeUser } = user;
    res.json({
      success: true,
      data: safeUser,
    });
  },
};
