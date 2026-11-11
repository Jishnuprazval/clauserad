import React from 'react';
import { RiskSeverity } from '../types';

interface RiskScoreBadgeProps {
  severity: RiskSeverity | string;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScoreBadge({ severity, size = 'md' }: RiskScoreBadgeProps) {
  const sevLower = severity.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (sevLower === 'critical') {
    styles = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800';
  } else if (sevLower === 'high') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
  } else if (sevLower === 'medium') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
  } else if (sevLower === 'low') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-semibold'
      : size === 'lg'
      ? 'px-3.5 py-1 text-sm font-bold tracking-wide'
      : 'px-2.5 py-0.5 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-mono uppercase tracking-wider ${styles} ${sizeClasses}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          sevLower === 'critical'
            ? 'bg-red-600 animate-pulse'
            : sevLower === 'high'
            ? 'bg-rose-500'
            : sevLower === 'medium'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />
      {severity}
    </span>
  );
}
