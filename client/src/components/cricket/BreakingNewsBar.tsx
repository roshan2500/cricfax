import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { Article } from '../../types';

export const BreakingNewsBar: React.FC = () => {
  const [breaking, setBreaking] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.getBreaking()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setBreaking(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (breaking.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % breaking.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [breaking.length]);

  if (breaking.length === 0) return null;

  const current = breaking[currentIndex];

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs sm:text-sm font-medium py-1.5 px-4 shadow-sm border-b border-red-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px] animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            Breaking News
          </span>
        </div>

        <Link
          to={`/articles/${current.slug}`}
          className="truncate flex-1 hover:underline flex items-center gap-1.5 transition-all text-slate-100 hover:text-white"
        >
          <span className="font-semibold text-amber-200">[{current.match_format}]</span>
          <span className="truncate">{current.title}</span>
          <ChevronRight className="w-4 h-4 shrink-0 text-white/70" />
        </Link>

        {breaking.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 shrink-0 text-[11px] text-white/80">
            <span>{currentIndex + 1} of {breaking.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};
