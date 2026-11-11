import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Printer,
  Share2,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  RefreshCw,
  Download,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { Analysis, Contract, DetectedClause, RiskSeverity } from '../types';
import { RiskScoreDial } from '../components/RiskScoreDial';
import { DocumentViewer } from '../components/DocumentViewer';
import { ClauseCard } from '../components/ClauseCard';

export function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction states
  const [selectedClauseIndex, setSelectedClauseIndex] = useState<number | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'All' | RiskSeverity>('All');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadReport() {
      if (!id) return;
      setLoading(false);
      setError(null);
      try {
        const res = await api.analysis.getById(id);
        setAnalysis(res.analysis);
        setContract(res.contract);
      } catch (err: any) {
        setError(err.message || 'Failed to load analysis report.');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filter clauses
  const filteredClauses = (analysis?.detectedClauses || []).filter(c => {
    if (severityFilter === 'All') return true;
    return c.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 text-center text-slate-500">
        <div className="space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Generating Risk Analysis Report...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/60 p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Not Found</h2>
          <p className="text-xs text-slate-500">{error || 'This report may have been deleted.'}</p>
          <Link
            to="/analyze"
            className="inline-block px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 text-xs"
          >
            Start New Analysis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Top action header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 z-40 px-4 sm:px-6 lg:px-8 py-3.5 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/history')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Back to History"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {analysis.contractName}
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  {analysis.contractType}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Analyzed on {new Date(analysis.createdAt).toLocaleDateString()} at{' '}
                {new Date(analysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/compare?add=${analysis.contractId}`)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Panel Layout (Left: Original Doc Viewer | Right: Risk Score & Clause Cards) */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Original Contract Viewer with Highlight Markers (7 cols) */}
        <div className="lg:col-span-7 h-[700px] lg:h-[calc(100vh-13rem)] sticky top-36">
          <DocumentViewer
            text={contract?.extractedText || ''}
            detectedClauses={analysis.detectedClauses}
            selectedClauseIndex={selectedClauseIndex}
            onSelectClause={(idx) => setSelectedClauseIndex(idx)}
            fileName={contract?.originalFileName || analysis.contractName}
          />
        </div>

        {/* Right Panel: Risk Scoring & Detailed Clause Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Executive Summary & Score Card */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <RiskScoreDial
                score={analysis.riskScore}
                level={analysis.riskLevel}
                totalIssues={analysis.totalIssues}
                size="md"
              />

              {/* Severity Counts Breakdown */}
              <div className="w-full sm:w-auto grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
                  <div className="font-extrabold text-red-600 dark:text-red-400 text-lg font-mono">
                    {analysis.severityBreakdown.critical}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Critical</div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                  <div className="font-extrabold text-rose-600 dark:text-rose-400 text-lg font-mono">
                    {analysis.severityBreakdown.high}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">High</div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                  <div className="font-extrabold text-amber-600 dark:text-amber-400 text-lg font-mono">
                    {analysis.severityBreakdown.medium}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Medium</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg font-mono">
                    {analysis.severityBreakdown.low}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Low</div>
                </div>
              </div>
            </div>

            {/* Overall Analysis Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs leading-relaxed space-y-1">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                Executive Screening Summary
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                {analysis.analysisSummary}
              </p>
            </div>

            {/* AI Contextual Concerns if present */}
            {analysis.aiEnhancement?.contextualConcerns && analysis.aiEnhancement.contextualConcerns.length > 0 && (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs space-y-2">
                <span className="font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Contextual Risk Points
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {analysis.aiEnhancement.contextualConcerns.map((concern, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Clause Filter Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
              Filter By Severity ({filteredClauses.length}):
            </span>
            <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl">
              {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    severityFilter === sev
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* List of Detected Clause Cards */}
          <div className="space-y-4">
            {filteredClauses.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  No {severityFilter !== 'All' ? severityFilter : ''} risk clauses detected
                </h4>
                <p className="text-xs text-slate-500">
                  This document evaluated cleanly under this specific filter.
                </p>
              </div>
            ) : (
              filteredClauses.map((clause, idx) => {
                // Find actual global index in detectedClauses
                const globalIndex = analysis.detectedClauses.findIndex(
                  (c) => c.ruleId === clause.ruleId && c.startIndex === clause.startIndex
                );
                return (
                  <ClauseCard
                    key={`${clause.ruleId}-${idx}`}
                    clause={clause}
                    index={globalIndex !== -1 ? globalIndex : idx}
                    aiEnhancement={analysis.aiEnhancement}
                    isSelected={selectedClauseIndex === globalIndex}
                    onSelect={() => setSelectedClauseIndex(globalIndex)}
                    onJumpToDocument={() => setSelectedClauseIndex(globalIndex)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
