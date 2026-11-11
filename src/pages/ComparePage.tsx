import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Plus,
  ArrowRight,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { ComparisonData, Analysis } from '../types';
import { RiskScoreBadge } from '../components/RiskScoreBadge';
import { Sidebar } from '../components/Sidebar';

export function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [availableAnalyses, setAvailableAnalyses] = useState<Analysis[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's contracts for the selector
  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const res = await api.analysis.getHistory();
        setAvailableAnalyses(res.analyses);

        // Check if an initial contractId was passed in URL query
        const addId = searchParams.get('add');
        if (addId) {
          const match = res.analyses.find(a => a.contractId === addId);
          if (match) {
            setSelectedIds([match.contractId]);
          }
        } else if (res.analyses.length >= 2) {
          // Pre-select first two for quick demo
          setSelectedIds([res.analyses[0].contractId, res.analyses[1].contractId]);
        }
      } catch (err: any) {
        setError('Failed to load contract history for comparison.');
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [searchParams]);

  // Trigger comparison when selectedIds has 2+ items
  useEffect(() => {
    async function runComparison() {
      if (selectedIds.length < 2) {
        setComparison(null);
        return;
      }

      setComparing(true);
      setError(null);
      try {
        const res = await api.comparison.compare(selectedIds);
        setComparison(res.comparison);
      } catch (err: any) {
        setError(err.message || 'Failed to compare selected contracts.');
      } finally {
        setComparing(false);
      }
    }

    runComparison();
  }, [selectedIds]);

  const toggleContractSelection = (contractId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(contractId)) {
        return prev.filter(id => id !== contractId);
      } else {
        return [...prev, contractId];
      }
    });
  };

  return (
    <div className="flex-1 flex bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Scale className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Contract Comparison Matrix</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare two or more contracts side by side across 10 critical risk categories
          </p>
        </div>

        {/* Contract Selector Pills */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Contracts To Compare (Minimum 2):
            </span>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
              {selectedIds.length} Selected
            </span>
          </div>

          {availableAnalyses.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <p>You have not analyzed any contracts yet.</p>
              <Link to="/analyze" className="text-blue-600 font-bold underline">
                Analyze your first document now
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {availableAnalyses.map(a => {
                const isChecked = selectedIds.includes(a.contractId);
                return (
                  <button
                    key={a.contractId}
                    type="button"
                    onClick={() => toggleContractSelection(a.contractId)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                      isChecked
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{a.contractName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isChecked
                          ? 'bg-blue-700 text-white'
                          : a.riskScore >= 50
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {a.riskScore}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {comparing && (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-semibold">Synthesizing side-by-side comparison...</p>
          </div>
        )}

        {comparison && !comparing && (
          <div className="space-y-6">
            {/* Summary Highlights: Lowest vs Highest Risk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Lowest Relative Risk</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {comparison.lowestRisk.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Risk Score:{' '}
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {comparison.lowestRisk.score}/100
                  </span>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <span>Highest Relative Risk</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {comparison.highestRisk.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Risk Score:{' '}
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    {comparison.highestRisk.score}/100
                  </span>
                </p>
              </div>
            </div>

            {/* Key Structural Differences Identified */}
            {comparison.differences && comparison.differences.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Key Discrepancies & Missing Protections Between Agreements</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {comparison.differences.map((diff, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Side by Side Comparative Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Category-by-Category Clause Evaluation
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                      <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] w-48">
                        Risk Category
                      </th>
                      {comparison.contracts.map((c, idx) => (
                        <th key={idx} className="py-3 px-4 font-bold text-slate-900 dark:text-white text-xs min-w-[240px]">
                          <div>{c.name}</div>
                          <div className="flex items-center gap-2 font-normal text-slate-400 mt-0.5">
                            <span className="font-mono font-bold text-blue-600">
                              Score: {c.riskScore}/100
                            </span>
                            <span>•</span>
                            <span>{c.totalIssues} issues</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {comparison.categoryMatrix.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {row.category}
                        </td>
                        {comparison.contracts.map((_, cIdx) => {
                          const col = row[`contract_${cIdx}`];
                          return (
                            <td key={cIdx} className="py-3.5 px-4 align-top">
                              {col.detected ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <RiskScoreBadge severity={col.severity} size="sm" />
                                    <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                                      Flagged
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono italic">
                                    "{col.snippet}"
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>No red flag detected</span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-500 leading-relaxed">
              <strong>Comparison Disclaimer: </strong>
              {comparison.disclaimer}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
