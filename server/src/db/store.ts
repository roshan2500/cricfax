import { Pool } from 'pg';
import { config } from '../config';
import { User, Article, Category, Tag, Comment } from '../types';
import { initialUsers, initialCategories, initialTags, initialArticles, initialComments } from './mockData';

let pgPool: Pool | null = null;
let isPostgresConnected = false;

// In-Memory store fallback
class DataStore {
  public users: User[] = [...initialUsers];
  public categories: Category[] = [...initialCategories];
  public tags: Tag[] = [...initialTags];
  public articles: Article[] = [...initialArticles];
  public comments: Comment[] = [...initialComments];
  public refreshTokens: { id: string; userId: string; token: string; expiresAt: string }[] = [];

  constructor() {
    this.hydrateRelations();
  }

  public hydrateRelations() {
    this.articles = this.articles.map(art => {
      const author = this.users.find(u => u.id === art.author_id);
      const category = this.categories.find(c => c.id === art.category_id);
      return {
        ...art,
        author: author ? {
          id: author.id,
          full_name: author.full_name,
          username: author.username,
          avatar_url: author.avatar_url,
          bio: author.bio
        } : undefined,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : undefined,
        tags: this.tags.slice(0, 3)
      };
    });
  }
}

export const memoryStore = new DataStore();

export async function initDatabase(): Promise<void> {
  if (!config.databaseUrl) {
    console.log('ℹ️  No DATABASE_URL configured. Running with in-memory cricket data store.');
    return;
  }

  try {
    pgPool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
    });

    const client = await pgPool.connect();
    console.log('✅ Connected to PostgreSQL database successfully.');
    client.release();
    isPostgresConnected = true;
  } catch (err: any) {
    console.warn('⚠️  PostgreSQL connection failed:', err.message);
    console.log('ℹ️  Falling back smoothly to high-fidelity cricket dataset.');
    isPostgresConnected = false;
  }
}

export function getPool(): Pool | null {
  return isPostgresConnected ? pgPool : null;
}
