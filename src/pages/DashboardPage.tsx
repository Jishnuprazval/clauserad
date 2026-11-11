import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  FileSearch,
  Scale,
  Trash2,
  ExternalLink,
  Zap,
  TrendingUp,
  PieChart as PieIcon,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardData, Analysis } from '../types';
import { RiskScoreBadge } from '../components/RiskScoreBadge';
import { Sidebar } from '../components/Sidebar';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.analysis.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const [contractToDelete, setContractToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!contractToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await api.contracts.delete(contractToDelete.id);
      setSuccessMessage(`"${contractToDelete.name}" deleted successfully.`);
      setContractToDelete(null);
      await fetchDashboard();
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

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
        {/* Top greeting banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back{user ? `, ${user.name}` : ''}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time contract risk screening dashboard & historical compliance records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/analyze?demo=true')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Load Sample Demo</span>
            </button>
            <Link
              to="/analyze"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Analysis</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchDashboard}
              className="font-bold underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Contracts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Analyzed
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {loading ? '—' : data?.totalContractsAnalyzed ?? 0}
            </div>
            <p className="text-[11px] text-slate-500">All scanned agreements</p>
          </div>

          {/* High Risk */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                High Risk (≥50)
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 font-mono">
              {loading ? '—' : data?.highRiskContracts ?? 0}
            </div>
            <p className="text-[11px] text-slate-500">Service bonds, exit penalties</p>
          </div>

          {/* Moderate Risk */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Moderate Risk (25-49)
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {loading ? '—' : data?.mediumRiskContracts ?? 0}
            </div>
            <p className="text-[11px] text-slate-500">Notice traps, unilateral terms</p>
          </div>

          {/* Low Risk */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Low Risk (&lt;25)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {loading ? '—' : data?.lowRiskContracts ?? 0}
            </div>
            <p className="text-[11px] text-slate-500">Standard / clean terms</p>
          </div>
        </div>

        {/* Charts Section: Pie Distribution + Activity Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pie Chart: Risk Distribution */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Risk Category Distribution
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Live DB</span>
            </div>

            <div className="h-56 flex items-center justify-center">
              {loading ? (
                <div className="text-xs text-slate-400">Loading chart data...</div>
              ) : !data || data.totalContractsAnalyzed === 0 ? (
                <div className="text-center text-xs text-slate-400 space-y-2">
                  <p>No analyzed contracts yet.</p>
                  <Link to="/analyze" className="text-blue-600 font-semibold underline">
                    Analyze your first document
                  </Link>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.riskDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {data.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 mb-1"></span>
                <span className="text-slate-500">High Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {data?.highRiskContracts ?? 0}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mb-1"></span>
                <span className="text-slate-500">Moderate</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {data?.mediumRiskContracts ?? 0}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mb-1"></span>
                <span className="text-slate-500">Low Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {data?.lowRiskContracts ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Bar Chart: Analysis Activity */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Contract Analysis Activity Trend
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Submissions</span>
            </div>

            <div className="h-56">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading activity trend...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.activityTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="analyses" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
              Contract screening volume processed across timeline
            </p>
          </div>
        </div>

        {/* Recent Contracts Table */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Contract Analyses
              </h3>
              <p className="text-xs text-slate-500">Your latest screened documents and risk reports</p>
            </div>
            <Link
              to="/history"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All History</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase tracking-wider text-[10px] text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Contract Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Detected Clauses</th>
                  <th className="py-3 px-4">Scanned Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading contracts...
                    </td>
                  </tr>
                ) : !data?.recentAnalyses || data.recentAnalyses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 space-y-2">
                      <p>No contracts analyzed yet.</p>
                      <button
                        onClick={() => navigate('/analyze?demo=true')}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs"
                      >
                        Analyze Demo Internship Agreement
                      </button>
                    </td>
                  </tr>
                ) : (
                  data.recentAnalyses.map(a => (
                    <tr
                      key={a._id}
                      onClick={() => navigate(`/report/${a._id}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-[180px] truncate">
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
                      <td className="py-3.5 px-4">
                        <span className="font-mono">{a.totalIssues} issues</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/report/${a._id}`}
                            onClick={e => e.stopPropagation()}
                            className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold"
                          >
                            View Report
                          </Link>
                          <button
                            type="button"
                            onClick={e => {
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

        {/* Delete Confirmation Modal */}
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
                Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{contractToDelete.name}"</strong>? This will permanently remove its risk scores and highlighted clauses.
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
