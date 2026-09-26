import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recently';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (featured) {
    return (
      <Link to={`/articles/${article.slug}`} className="group block">
        <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[2/1] mb-4">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-red-600 font-medium">{article.category?.name || 'Cricket'}</span>
            <span>·</span>
            <span>{article.read_time_minutes} min read</span>
            <span>·</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
            {article.title}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <img
              src={article.author?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
              alt={article.author?.full_name || 'Author'}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600">{article.author?.full_name || 'Staff'}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/articles/${article.slug}`} className="group block">
      <article className="flex flex-col h-full">
        <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[16/10] mb-3">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
            <span className="text-red-600 font-medium">{article.category?.name || 'Cricket'}</span>
            <span>·</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-1.5 text-[15px]">
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-3">
            {article.excerpt}
          </p>
          <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
            <span>{article.author?.full_name || 'Staff'}</span>
            <span>·</span>
            <span>{article.read_time_minutes} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
};
