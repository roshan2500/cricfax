import { Request, Response } from 'express';
import { memoryStore } from '../db/store';

export const authorController = {
  async getAuthorByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const user = memoryStore.users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      res.status(404).json({ success: false, error: 'Author not found' });
      return;
    }

    memoryStore.hydrateRelations();
    const articles = memoryStore.articles
      .filter(a => a.author_id === user.id && a.status === 'PUBLISHED')
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

    const totalViews = articles.reduce((sum, a) => sum + (Number(a.views_count) || 0), 0);

    const { password_hash: _, ...safeUser } = user;

    res.json({
      success: true,
      data: {
        author: {
          ...safeUser,
          totalArticles: articles.length,
          totalViews,
        },
        articles,
      },
    });
  },
};
