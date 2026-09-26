import React, { useEffect, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { ArticleCard } from '../components/common/ArticleCard';
import { api } from '../services/api';
import { Article } from '../types';

export const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      setIsLoading(true);
      try {
        const res = await api.getArticles({ limit: 30 });
        if (res.data) setArticles(res.data);
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadArticles();
  }, []);

  const filteredArticles = filterQuery.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : articles;

  return (
    <div className="space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All News</h1>
          <p className="text-sm text-gray-500 mt-0.5">{articles.length} articles</p>
        </div>
        <div className="relative w-full sm:w-60">
          <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter articles..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles match "{filterQuery}"</p>
          <button onClick={() => setFilterQuery('')} className="mt-2 text-red-600 text-sm hover:underline">Clear filter</button>
        </div>
      )}
    </div>
  );
};
