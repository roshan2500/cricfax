import { Request, Response } from 'express';
import { memoryStore } from '../db/store';

export const searchController = {
  async search(req: Request, res: Response): Promise<void> {
    const q = ((req.query.q as string) || '').trim().toLowerCase();
    const category = req.query.category as string;
    const format = req.query.format as string;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);

    memoryStore.hydrateRelations();
    let results = memoryStore.articles.filter(a => a.status === 'PUBLISHED');

    if (q) {
      results = results.filter(a => {
        const titleMatch = a.title.toLowerCase().includes(q);
        const excerptMatch = a.excerpt.toLowerCase().includes(q);
        const contentMatch = a.content.toLowerCase().includes(q);
        const authorMatch = a.author?.full_name.toLowerCase().includes(q) || a.author?.username.toLowerCase().includes(q);
        const tagMatch = a.tags?.some(t => t.name.toLowerCase().includes(q));
        const categoryMatch = a.category?.name.toLowerCase().includes(q);
        return titleMatch || excerptMatch || contentMatch || authorMatch || tagMatch || categoryMatch;
      });
    }

    if (category) {
      results = results.filter(a => a.category?.slug === category || a.category_id === category);
    }
    if (format) {
      results = results.filter(a => a.match_format.toLowerCase() === format.toLowerCase());
    }

    // Sort by views / relevance / recent
    results.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

    const total = results.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    res.json({
      success: true,
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages,
        query: q,
      },
    });
  },
};
