import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../services/api';
import { Article, User, Category } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'users'>('articles');
  const [isLoading, setIsLoading] = useState(true);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', featured_image_url: '',
    category_id: '', match_format: 'IPL' as any,
    is_breaking: false, is_featured: false, status: 'PUBLISHED' as any,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, articlesRes, categoriesRes, usersRes] = await Promise.all([
        api.getAdminStats(), api.getAdminArticles(), api.getCategories(), api.getAdminUsers(),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (articlesRes.data) setArticles(articlesRes.data);
      if (categoriesRes.data) {
        setCategories(categoriesRes.data);
        if (!formData.category_id && categoriesRes.data[0]) {
          setFormData(prev => ({ ...prev, category_id: categoriesRes.data[0].id }));
        }
      }
      if (usersRes.data) setUsersList(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenCreateModal = () => {
    setEditingArticleId(null);
    setFormData({
      title: '', slug: '', excerpt: '', content: '',
      featured_image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
      category_id: categories[0]?.id || '', match_format: 'IPL',
      is_breaking: false, is_featured: false, status: 'PUBLISHED',
    });
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (article: Article) => {
    setEditingArticleId(article.id);
    setFormData({
      title: article.title, slug: article.slug, excerpt: article.excerpt,
      content: article.content, featured_image_url: article.featured_image_url,
      category_id: article.category_id, match_format: article.match_format,
      is_breaking: article.is_breaking, is_featured: article.is_featured, status: article.status,
    });
    setIsEditorOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingArticleId) await api.updateArticle(editingArticleId, formData);
      else await api.createArticle(formData);
      setIsEditorOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving article');
    }
  };

  const handleToggleStatus = async (id: string, status: string) => {
    try {
      await api.updateArticleStatus(id, status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');
      await loadData();
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Delete this article?')) return;
    try { await api.deleteArticle(id); await loadData(); }
    catch (err: any) { alert(err.message); }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try { await api.updateUserRole(userId, role); await loadData(); }
    catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-6 pb-16">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your content</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New article
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Articles', value: stats.totalArticles, sub: `${stats.publishedArticles} published` },
            { label: 'Views', value: stats.totalViews.toLocaleString(), sub: 'Total reads' },
            { label: 'Users', value: stats.totalUsers, sub: `${stats.totalAuthors} writers` },
            { label: 'Comments', value: stats.totalComments, sub: 'All time' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(['articles', 'users'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Articles tab */}
      {activeTab === 'articles' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Author</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Views</th>
                <th className="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900 max-w-md truncate">{article.title}</div>
                    <div className="text-xs text-gray-400">{article.category?.name || 'Cricket'}</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{article.author?.full_name || 'Admin'}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      article.status === 'PUBLISHED' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>{article.status.toLowerCase()}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{Number(article.views_count).toLocaleString()}</td>
                  <td className="py-3 text-right space-x-1">
                    <button onClick={() => handleToggleStatus(article.id, article.status)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                      {article.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => handleOpenEditModal(article)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteArticle(article.id)} className="p-1 text-gray-400 hover:text-red-600 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 pr-4 font-medium">Joined</th>
                <th className="py-2 text-right font-medium">Change role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <img src={u.avatar_url || ''} alt={u.full_name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-gray-900">{u.full_name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{u.role}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      <option value="READER">Reader</option>
                      <option value="AUTHOR">Author</option>
                      <option value="EDITOR">Editor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="relative w-full max-w-2xl bg-white rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditorOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingArticleId ? 'Edit article' : 'New article'}
            </h3>
            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select value={formData.match_format}
                    onChange={(e) => setFormData({ ...formData, match_format: e.target.value as any })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                    <option value="IPL">IPL</option>
                    <option value="TEST">Test</option>
                    <option value="T20I">T20I</option>
                    <option value="ODI">ODI</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" required value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea rows={2} required value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea rows={8} required value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                  Featured
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                  {editingArticleId ? 'Save changes' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
