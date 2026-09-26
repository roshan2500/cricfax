import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Article, Comment } from '../types';
import { ArticleCard } from '../components/common/ArticleCard';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [readerName, setReaderName] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    api.getArticleBySlug(slug)
      .then(res => {
        if (res.data) {
          setArticle(res.data.article);
          setRelated(res.data.related || []);
          setComments(res.data.comments || []);
        }
      })
      .catch(err => setError(err.message || 'Article not found'))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      const res = await api.addComment(article.id, commentText.trim(), readerName.trim() || 'Reader');
      if (res.data) {
        setComments([res.data, ...comments]);
        setCommentText('');
        setReaderName('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-4 animate-pulse">
        <div className="h-6 w-24 bg-gray-100 rounded" />
        <div className="h-10 w-full bg-gray-100 rounded" />
        <div className="h-80 w-full bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Article not found</h2>
        <p className="text-gray-500 text-sm mb-4">This article may have been moved or deleted.</p>
        <Link to="/" className="text-red-600 text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto pb-16">
      
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link to="/" className="text-gray-400 hover:text-gray-600">Home</Link>
        <span className="text-gray-300 mx-2">/</span>
        <Link to="/articles" className="text-gray-400 hover:text-gray-600">News</Link>
      </div>

      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span className="text-red-600 font-medium">{article.category?.name || 'Cricket'}</span>
          <span>·</span>
          <span>{formatDate(article.published_at)}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {article.excerpt}
        </p>
      </header>

      {/* Author byline */}
      <div className="flex items-center gap-3 py-4 border-y border-gray-100 mb-8">
        <Link to={`/authors/${article.author?.username || 'admin'}`}>
          <img
            src={article.author?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={article.author?.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link to={`/authors/${article.author?.username || 'admin'}`} className="text-sm font-medium text-gray-900 hover:text-red-600">
            {article.author?.full_name}
          </Link>
          <p className="text-xs text-gray-400">{article.read_time_minutes} min read · {Number(article.views_count).toLocaleString()} views</p>
        </div>
        <button onClick={handleCopyLink} className="ml-auto text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">Share</button>
      </div>

      {/* Featured image */}
      <div className="rounded-lg overflow-hidden mb-8">
        <img
          src={article.featured_image_url}
          alt={article.title}
          className="w-full max-h-[440px] object-cover"
        />
      </div>

      {/* Article body */}
      <div className="prose prose-gray max-w-none text-gray-700 text-[16px] leading-[1.8]">
        {article.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-3">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote key={index} className="border-l-3 border-red-500 pl-4 my-6 italic text-gray-600">
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }
          if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
            const items = paragraph.split('\n');
            return (
              <ul key={index} className="list-disc pl-5 my-4 space-y-1 text-gray-700">
                {items.map((it, idx) => (
                  <li key={idx}>{it.replace(/^[-*]|\d+\.\s*/, '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={index} className="mb-4">{paragraph}</p>;
        })}
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          {article.tags.map(tag => (
            <Link
              key={tag.id}
              to={`/search?q=${encodeURIComponent(tag.name)}`}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Comments */}
      <section className="mt-10 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Comments ({comments.length})</h3>

        <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={readerName}
              onChange={(e) => setReaderName(e.target.value)}
              placeholder="Name (optional)"
              className="w-40 bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
          <textarea
            rows={3}
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmittingComment ? 'Posting...' : 'Post comment'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="py-4 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900">{c.user?.full_name || 'Reader'}</span>
                <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-10 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Related stories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(r => <ArticleCard key={r.id} article={r} />)}
          </div>
        </section>
      )}
    </article>
  );
};
