import React, { useState } from 'react';
import { DetectedClause } from '../types';
import { RiskScoreBadge } from './RiskScoreBadge';
import { HelpCircle, MessageSquareQuote, CheckCheck, Copy, Sparkles, AlertCircle, Compass, FileText } from 'lucide-react';

interface ClauseCardProps {
  clause: DetectedClause;
  index: number;
  aiEnhancement?: any;
  isSelected?: boolean;
  onSelect?: () => void;
  onJumpToDocument?: () => void;
}

export function ClauseCard({
  clause,
  index,
  aiEnhancement,
  isSelected,
  onSelect,
  onJumpToDocument,
}: ClauseCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const matchingAiClause = aiEnhancement?.enhancedClauses?.find(
    (e: any) => e.ruleId === clause.ruleId
  );

  const handleCopyQuestion = (text: string, qIdx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(qIdx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getBorderColor = () => {
    if (isSelected) return 'ring-2 ring-blue-600 dark:ring-blue-400 border-blue-500';
    if (clause.severity === 'Critical') return 'border-red-300 dark:border-red-800/80 hover:border-red-400';
    if (clause.severity === 'High') return 'border-rose-200 dark:border-rose-800/70 hover:border-rose-300';
    if (clause.severity === 'Medium') return 'border-amber-200 dark:border-amber-800/70 hover:border-amber-300';
    return 'border-slate-200 dark:border-slate-800 hover:border-slate-300';
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl p-5 bg-white dark:bg-slate-900 border transition-all shadow-xs hover:shadow-md cursor-pointer ${getBorderColor()}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono text-xs font-bold">
            #{index + 1}
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {clause.riskCategory}
          </h3>
          <RiskScoreBadge severity={clause.severity} />
        </div>

        {clause.pageNumber && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
            Page ~{clause.pageNumber}
          </span>
        )}
      </div>

      {/* Matched excerpt in original text */}
      <div className="mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border-l-4 border-l-amber-500 dark:border-l-amber-400 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic">
        "{clause.matchedClauseText}"
      </div>

      {/* Plain English explanation */}
      <div className="space-y-3 text-sm">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Plain-English Translation
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {matchingAiClause?.plainEnglishExplanation || clause.riskExplanation}
          </p>
        </div>

        {/* Why this matters */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Why This Matters To You
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {matchingAiClause?.laymanTakeaway || clause.whyItMatters}
          </p>
        </div>

        {/* AI Specific Counter-Proposal if present */}
        {matchingAiClause?.specificCounterProposal && (
          <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Recommended Counter-Language
            </div>
            <p className="text-blue-800 dark:text-blue-200 italic font-mono">
              "{matchingAiClause.specificCounterProposal}"
            </p>
          </div>
        )}

        {/* Suggested Questions */}
        {clause.suggestedQuestions && clause.suggestedQuestions.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Suggested Questions To Ask
            </div>
            <ul className="space-y-1.5">
              {clause.suggestedQuestions.map((q, qIdx) => (
                <li
                  key={qIdx}
                  className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="leading-snug">• {q}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyQuestion(q, qIdx);
                    }}
                    className="shrink-0 p-1 rounded text-slate-400 hover:text-blue-600 transition-colors"
                    title="Copy question"
                  >
                    {copiedIndex === qIdx ? (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested Negotiation Points */}
        {clause.suggestedNegotiationPoints && clause.suggestedNegotiationPoints.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Negotiation Strategies
            </div>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              {clause.suggestedNegotiationPoints.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold shrink-0">→</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Jump to Document Action */}
        {onJumpToDocument && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJumpToDocument();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              Locate & highlight in document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
