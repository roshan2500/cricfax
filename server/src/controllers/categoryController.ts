import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../db/store';
import { Category } from '../types';

export const categoryController = {
  async getCategories(req: Request, res: Response): Promise<void> {
    const categoriesWithCount = memoryStore.categories.map(c => {
      const articleCount = memoryStore.articles.filter(a => a.category_id === c.id && a.status === 'PUBLISHED').length;
      return {
        ...c,
        articleCount,
      };
    });

    res.json({
      success: true,
      data: categoriesWithCount,
    });
  },

  async getCategoryBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;
    const category = memoryStore.categories.find(c => c.slug === slug);

    if (!category) {
      res.status(404).json({ success: false, error: 'Category not found' });
      return;
    }

    memoryStore.hydrateRelations();
    const articles = memoryStore.articles
      .filter(a => a.category_id === category.id && a.status === 'PUBLISHED')
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

    res.json({
      success: true,
      data: {
        category,
        articles,
      },
    });
  },

  async createCategory(req: Request, res: Response): Promise<void> {
    const { name, slug, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, error: 'Category name is required' });
      return;
    }

    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const exists = memoryStore.categories.some(c => c.slug === categorySlug);

    if (exists) {
      res.status(409).json({ success: false, error: 'Category with this slug already exists' });
      return;
    }

    const newCategory: Category = {
      id: uuidv4(),
      name,
      slug: categorySlug,
      description: description || '',
      display_order: memoryStore.categories.length + 1,
      created_at: new Date().toISOString(),
    };

    memoryStore.categories.push(newCategory);

    res.status(201).json({
      success: true,
      data: newCategory,
    });
  },
};
