import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Cric<span className="text-red-600">Fax</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50">Home</Link>
            <Link to="/articles" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50">News</Link>
            <Link to="/admin" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-50">Dashboard</Link>
          </nav>

          {/* Search + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 bg-gray-100 border border-gray-200 rounded-lg py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </form>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
          </form>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Home</Link>
          <Link to="/articles" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">News</Link>
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">Dashboard</Link>
        </div>
      )}
    </header>
  );
};
