import React from 'react';
import { Activity } from 'lucide-react';

interface MatchItem {
  id: string;
  tournament: string;
  format: string;
  team1: { name: string; code: string; score: string; overs: string; flag: string };
  team2: { name: string; code: string; score: string; overs?: string; flag: string };
  status: string;
  isLive: boolean;
}

const SAMPLE_MATCHES: MatchItem[] = [
  {
    id: 'm1',
    tournament: 'Border-Gavaskar Trophy',
    format: 'TEST',
    team1: { name: 'India', code: 'IND', score: '382 & 186/3', overs: '48.2 ov', flag: '🇮🇳' },
    team2: { name: 'Australia', code: 'AUS', score: '320', flag: '🇦🇺' },
    status: 'Day 4: IND lead by 248 runs',
    isLive: true,
  },
  {
    id: 'm2',
    tournament: 'IPL 2026 • Match 34',
    format: 'T20',
    team1: { name: 'Mumbai Indians', code: 'MI', score: '214/4', overs: '20.0 ov', flag: '🔵' },
    team2: { name: 'Chennai Super Kings', code: 'CSK', score: '189/6', overs: '18.1 ov', flag: '🟡' },
    status: 'CSK need 26 runs in 11 balls',
    isLive: true,
  },
  {
    id: 'm3',
    tournament: 'WPL 2026 Final',
    format: 'T20',
    team1: { name: 'Royal Challengers', code: 'RCB-W', score: '178/5', overs: '20.0 ov', flag: '🔴' },
    team2: { name: 'Delhi Capitals', code: 'DC-W', score: '162/8', overs: '20.0 ov', flag: '🔵' },
    status: 'RCB-W won by 16 runs',
    isLive: false,
  },
  {
    id: 'm4',
    tournament: 'England Tour of South Africa',
    format: 'ODI',
    team1: { name: 'England', code: 'ENG', score: '312/7', overs: '50.0 ov', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    team2: { name: 'South Africa', code: 'SA', score: 'Target: 313', flag: '🇿🇦' },
    status: 'Innings Break',
    isLive: true,
  }
];

export const MatchTicker: React.FC = () => {
  return (
    <div className="bg-slate-950 border-b border-slate-800 py-2 px-4 overflow-x-auto scrollbar-none text-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-4 min-w-max">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 border-r border-slate-800 pr-3 shrink-0">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Live Scores</span>
        </div>

        <div className="flex items-center gap-3">
          {SAMPLE_MATCHES.map(match => (
            <div
              key={match.id}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-md px-3 py-1.5 flex flex-col gap-1 min-w-[210px] transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-medium truncate max-w-[130px]">{match.tournament}</span>
                {match.isLive ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                    LIVE
                  </span>
                ) : (
                  <span className="text-slate-500 font-semibold">{match.format}</span>
                )}
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] font-semibold text-slate-200">
                <div className="flex items-center gap-1.5">
                  <span>{match.team1.flag}</span>
                  <span>{match.team1.code}</span>
                </div>
                <span>{match.team1.score}</span>
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] font-semibold text-slate-200">
                <div className="flex items-center gap-1.5">
                  <span>{match.team2.flag}</span>
                  <span>{match.team2.code}</span>
                </div>
                <span>{match.team2.score}</span>
              </div>

              <div className="text-[10px] text-amber-400/90 truncate pt-0.5 border-t border-slate-800/60 font-medium">
                {match.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
