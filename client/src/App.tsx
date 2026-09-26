import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { HomePage } from './pages/HomePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AuthorPage } from './pages/AuthorPage';
import { SearchPage } from './pages/SearchPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        
        <Navbar />

        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/authors/:username" element={<AuthorPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-16 py-8 text-gray-500 text-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900 text-sm">Cric<span className="text-red-600">Fax</span></span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span>Cricket news, analysis & opinion</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <Link to="/" className="hover:text-gray-600">Home</Link>
                <Link to="/articles" className="hover:text-gray-600">News</Link>
                <Link to="/search" className="hover:text-gray-600">Search</Link>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-gray-400">
              © 2026 CricFax. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
};
