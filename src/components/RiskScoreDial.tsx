import React from 'react';
import { RiskLevel } from '../types';

interface RiskScoreDialProps {
  score: number;
  level: RiskLevel;
  totalIssues?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScoreDial({ score, level, totalIssues, size = 'md' }: RiskScoreDialProps) {
  const boundedScore = Math.min(100, Math.max(0, score));

  // Determine stroke color and theme based on score
  let strokeColor = '#16A34A'; // emerald-600
  let textColor = 'text-emerald-600 dark:text-emerald-400';
  let bgColor = 'bg-emerald-50 dark:bg-emerald-950/40';

  if (boundedScore >= 75) {
    strokeColor = '#DC2626'; // red-600
    textColor = 'text-red-600 dark:text-red-400';
    bgColor = 'bg-red-50 dark:bg-red-950/40';
  } else if (boundedScore >= 50) {
    strokeColor = '#EA580C'; // orange-600
    textColor = 'text-orange-600 dark:text-orange-400';
    bgColor = 'bg-orange-50 dark:bg-orange-950/40';
  } else if (boundedScore >= 25) {
    strokeColor = '#F59E0B'; // amber-500
    textColor = 'text-amber-600 dark:text-amber-400';
    bgColor = 'bg-amber-50 dark:bg-amber-950/40';
  }

  const dimensions = size === 'sm' ? 100 : size === 'lg' ? 180 : 140;
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 14 : 10;
  const radius = (dimensions - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={dimensions} height={dimensions} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Animated value arc */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-mono font-extrabold tracking-tight ${size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-xl' : 'text-3xl'} ${textColor}`}>
            {boundedScore}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${bgColor} ${textColor} border border-current/20`}>
          {level}
        </span>
        {totalIssues !== undefined && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {totalIssues} risk {totalIssues === 1 ? 'factor' : 'factors'} detected
          </p>
        )}
      </div>
    </div>
  );
}
