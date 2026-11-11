import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Scale,
  PlusCircle,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { Analysis } from '../types';
import { RiskScoreBadge } from '../components/RiskScoreBadge';
import { Sidebar } from '../components/Sidebar';

export function HistoryPage() {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [riskLevel, setRiskLevel] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Delete modal state
  const [contractToDelete, setContractToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.analysis.getHistory({
        search,
        category,
        riskLevel,
        sortBy,
        sortOrder,
      });
      setAnalyses(res.analyses);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contract analysis records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, category, riskLevel, sortBy, sortOrder]);

  const confirmDelete = async () => {
    if (!contractToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await api.contracts.delete(contractToDelete.id);
      setSuccessMessage(`"${contractToDelete.name}" and its analysis were deleted successfully.`);
      setContractToDelete(null);
      await fetchHistory();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete contract.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Analysis History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search, filter, compare, and audit all previously evaluated agreements
            </p>
          </div>

          <Link
            to="/analyze"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze New Contract</span>
          </Link>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-600 hover:text-emerald-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search contract name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Internship Offer Letter">Internship Offer Letter</option>
                <option value="Employment Agreement">Employment Agreement</option>
                <option value="Rental Agreement">Rental Agreement</option>
                <option value="Freelance Contract">Freelance Contract</option>
                <option value="Service Agreement">Service Agreement</option>
                <option value="Terms of Service">Terms of Service</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Risk Level Filter */}
            <div>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Risk Levels</option>
                <option value="Very High Risk">Very High Risk (75-100)</option>
                <option value="High Risk">High Risk (50-74)</option>
                <option value="Moderate Risk">Moderate Risk (25-49)</option>
                <option value="Low Risk">Low Risk (0-24)</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, ord] = e.target.value.split('-');
                  setSortBy(by as 'date' | 'score');
                  setSortOrder(ord as 'asc' | 'desc');
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Risk Score</option>
                <option value="score-asc">Lowest Risk Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase tracking-wider text-[10px] text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Contract Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Detected Clauses</th>
                  <th className="py-3 px-4">Date Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading records...
                    </td>
                  </tr>
                ) : analyses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 space-y-3">
                      <p>No contracts match your search or filter criteria.</p>
                      <button
                        onClick={() => {
                          setSearch('');
                          setCategory('All');
                          setRiskLevel('All');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs"
                      >
                        Reset Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  analyses.map((a) => (
                    <tr
                      key={a._id}
                      onClick={() => navigate(`/report/${a._id}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                        {a.contractName}
                      </td>
                      <td className="py-3.5 px-4">{a.contractType}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            a.riskScore >= 75
                              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                              : a.riskScore >= 50
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                              : a.riskScore >= 25
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {a.riskScore} / 100 ({a.riskLevel})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{a.totalIssues} flagged</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/report/${a._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold"
                          >
                            Report
                          </Link>
                          <Link
                            to={`/compare?add=${a.contractId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Compare contract"
                          >
                            <Scale className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setContractToDelete({ id: a.contractId || a._id, name: a.contractName });
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete contract"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom In-App Delete Confirmation Modal (no window.confirm) */}
        {contractToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setContractToDelete(null)}
          >
            <div
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Delete Contract Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    Permanently remove this contract analysis
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{contractToDelete.name}"</strong> and all of its associated clause risk highlights? This action cannot be reversed.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setContractToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Permanently</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
