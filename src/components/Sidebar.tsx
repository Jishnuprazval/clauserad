import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSearch, History, Scale, User, ShieldCheck, Zap } from 'lucide-react';

export function Sidebar() {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analyze', label: 'Analyze Contract', icon: FileSearch },
    { to: '/history', label: 'Analysis History', icon: History },
    { to: '/compare', label: 'Compare Contracts', icon: Scale },
    { to: '/profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            Menu
          </span>
          <nav className="mt-2 space-y-1">
            {links.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Engine Status badge */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Detection Engine</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Rule Engine:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">10 Active Rules</span>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Explanations:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Gemini 3.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro tip */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300 mb-1">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Need Negotiation Help?</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300">
          Check each clause card in the analysis report for ready-to-use counter-proposals to send to recruiters.
        </p>
      </div>
    </aside>
  );
}
