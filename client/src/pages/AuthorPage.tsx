import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Article, User } from '../types';
import { ArticleCard } from '../components/common/ArticleCard';

export const AuthorPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [author, setAuthor] = useState<(User & { totalArticles: number; totalViews: number }) | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    setIsLoading(true);
    api.getAuthor(username)
      .then(res => {
        if (res.data) {
          setAuthor(res.data.author);
          setArticles(res.data.articles || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [username]);

  if (isLoading) {
    return (
      <div className="py-8 space-y-4 animate-pulse">
        <div className="h-32 bg-gray-100 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-60 bg-gray-100 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Author not found</h2>
        <Link to="/" className="text-red-600 text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">← Back</Link>

      {/* Author header */}
      <div className="flex items-start gap-5">
        <img
          src={author.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
          alt={author.full_name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{author.full_name}</h1>
          <p className="text-sm text-gray-500 mt-1">{author.bio || 'Cricket writer at CricFax'}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span><strong className="text-gray-900">{author.totalArticles}</strong> articles</span>
            <span><strong className="text-gray-900">{author.totalViews.toLocaleString()}</strong> views</span>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-200">
          Articles by {author.full_name}
        </h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {articles.map(article => <ArticleCard key={article.id} article={article} />)}
          </div>
        ) : (
          <p className="text-gray-500 text-sm py-8 text-center">No published articles yet.</p>
        )}
      </div>
    </div>
  );
};
