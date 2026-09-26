import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { Article, Category } from '../types';
import { ArticleCard } from '../components/common/ArticleCard';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    api.getCategoryBySlug(slug)
      .then(res => {
        if (res.data) {
          setCategory(res.data.category);
          setArticles(res.data.articles || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-12 space-y-6 animate-pulse">
        <div className="h-20 bg-slate-800 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Category Not Found</h2>
        <Link to="/" className="text-emerald-400 text-sm hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Link to="/articles" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{category.name}</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {category.description}
          </p>
          <div className="text-xs text-slate-400 font-semibold pt-1">
            {articles.length} {articles.length === 1 ? 'Article' : 'Articles'} in this hub
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-800">
          <p className="text-slate-300 text-sm">No published stories in this category yet.</p>
        </div>
      )}
    </div>
  );
};
