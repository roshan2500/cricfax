import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { api } from '../services/api';
import { Article } from '../types';
import { ArticleCard } from '../components/common/ArticleCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  useEffect(() => {
    async function executeSearch() {
      setIsLoading(true);
      try {
        const res = await api.search(searchTerm);
        if (res.data) setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    const timer = setTimeout(() => executeSearch(), 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setSearchParams(val ? { q: val } : {});
  };

  return (
    <div className="space-y-6 pb-12">
      
      <div className="py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search</h1>
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search for players, tournaments, teams..."
            autoFocus
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>
      </div>

      <div className="text-sm text-gray-500 pb-2 border-b border-gray-200">
        {isLoading ? 'Searching...' : `${results.length} result${results.length === 1 ? '' : 's'}`}
        {searchTerm && <span> for "{searchTerm}"</span>}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-60 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {results.map(article => <ArticleCard key={article.id} article={article} />)}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No results found.</p>
          <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
        </div>
      ) : null}
    </div>
  );
};
