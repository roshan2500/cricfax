import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/common/ArticleCard';
import { api } from '../services/api';
import { Article } from '../types';

export const HomePage: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeContent() {
      setIsLoading(true);
      try {
        const [featuredRes, latestRes] = await Promise.all([
          api.getFeatured(),
          api.getArticles({ limit: 8 }),
        ]);
        if (featuredRes.data) setFeaturedArticles(featuredRes.data);
        if (latestRes.data) setLatestArticles(latestRes.data);
      } catch (err) {
        console.error('Failed to load home content:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeContent();
  }, []);

  const heroArticle = featuredArticles[0] || latestArticles[0];
  const remainingArticles = latestArticles.filter(a => a.id !== heroArticle?.id);

  if (isLoading) {
    return (
      <div className="space-y-6 py-4">
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-60 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero */}
      {heroArticle && (
        <section>
          <ArticleCard article={heroArticle} featured={true} />
        </section>
      )}

      {/* Divider */}
      <div className="border-b border-gray-200" />

      {/* Latest Articles */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Latest</h2>
          <Link to="/articles" className="text-sm text-red-600 hover:text-red-700 font-medium">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {remainingArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Sidebar-style section at bottom for larger screens */}
      <section className="border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">About CricFax</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              CricFax is an independent cricket news publication covering international cricket, domestic leagues, and tactical analysis. We bring you match reports, player profiles, and opinion pieces from writers who live and breathe the sport.
            </p>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Stay updated</h3>
            <p className="text-sm text-gray-500 mb-3">Get the latest cricket news delivered to your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
