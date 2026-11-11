import React, { useState, useEffect, useRef } from 'react';
import { DetectedClause } from '../types';
import { Search, ChevronDown, ChevronUp, FileText, ZoomIn, ZoomOut, Maximize2, ShieldAlert } from 'lucide-react';

interface DocumentViewerProps {
  text: string;
  detectedClauses: DetectedClause[];
  selectedClauseIndex: number | null;
  onSelectClause: (index: number) => void;
  fileName?: string;
}

export function DocumentViewer({
  text,
  detectedClauses,
  selectedClauseIndex,
  onSelectClause,
  fileName,
}: DocumentViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSize, setFontSize] = useState<number>(14);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when a clause is selected externally
  useEffect(() => {
    if (selectedClauseIndex !== null) {
      const el = document.getElementById(`clause-mark-${selectedClauseIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedClauseIndex]);

  // Color mapping helper for severity
  const getHighlightStyle = (severity: string, isSelected: boolean) => {
    const sev = severity.toLowerCase();
    if (isSelected) {
      return 'bg-blue-300/80 text-blue-950 dark:bg-blue-600/70 dark:text-white ring-3 ring-blue-500 font-medium rounded-xs shadow-sm';
    }
    if (sev === 'critical') {
      return 'bg-red-200/80 text-red-950 dark:bg-red-900/60 dark:text-red-100 border-b-2 border-red-500 rounded-xs';
    }
    if (sev === 'high') {
      return 'bg-rose-200/80 text-rose-950 dark:bg-rose-900/60 dark:text-rose-100 border-b-2 border-rose-500 rounded-xs';
    }
    if (sev === 'medium') {
      return 'bg-amber-200/80 text-amber-950 dark:bg-amber-900/60 dark:text-amber-100 border-b-2 border-amber-500 rounded-xs';
    }
    return 'bg-emerald-200/80 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-100 border-b-2 border-emerald-500 rounded-xs';
  };

  /**
   * Builds an array of rendered chunks by mapping each detected clause span onto the document
   */
  const renderHighlightedDocument = () => {
    if (!text) {
      return <div className="p-8 text-center text-slate-400">No document text available.</div>;
    }

    // Sort detected clauses by appearance in text
    interface Marker {
      start: number;
      end: number;
      clauseIndex: number;
      clause: DetectedClause;
    }

    const markers: Marker[] = [];

    detectedClauses.forEach((clause, index) => {
      // Find actual substring occurrence
      const snippet = clause.matchedClauseText.trim();
      let pos = text.indexOf(snippet);

      // If exact whole snippet isn't matched due to whitespace differences, try first 50 chars
      if (pos === -1 && snippet.length > 30) {
        pos = text.indexOf(snippet.slice(0, 40));
      }

      if (pos !== -1) {
        const end = Math.min(text.length, pos + snippet.length);
        markers.push({
          start: pos,
          end,
          clauseIndex: index,
          clause,
        });
      }
    });

    // Sort markers by starting index
    markers.sort((a, b) => a.start - b.start);

    // Filter out overlapping markers
    const nonOverlapping: Marker[] = [];
    let lastEnd = 0;
    for (const m of markers) {
      if (m.start >= lastEnd) {
        nonOverlapping.push(m);
        lastEnd = m.end;
      }
    }

    // Slice text into plain and highlighted chunks
    const elements: React.ReactNode[] = [];
    let cursor = 0;

    nonOverlapping.forEach((marker, i) => {
      // Text before match
      if (marker.start > cursor) {
        const plain = text.substring(cursor, marker.start);
        elements.push(
          <span key={`plain-${cursor}`}>
            {highlightSearchTerms(plain, searchTerm)}
          </span>
        );
      }

      // Highlighted match
      const matched = text.substring(marker.start, marker.end);
      const isSelected = selectedClauseIndex === marker.clauseIndex;

      elements.push(
        <mark
          key={`mark-${marker.clauseIndex}`}
          id={`clause-mark-${marker.clauseIndex}`}
          onClick={() => onSelectClause(marker.clauseIndex)}
          className={`cursor-pointer transition-all duration-300 relative group px-1 py-0.5 my-0.5 inline-block ${getHighlightStyle(
            marker.clause.severity,
            isSelected
          )}`}
          title={`Click to view analysis: ${marker.clause.riskCategory} (${marker.clause.severity})`}
        >
          {highlightSearchTerms(matched, searchTerm)}
          <span className="inline-flex items-center ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-white/90 text-slate-900 dark:bg-slate-900/90 dark:text-white shadow-2xs">
            #{marker.clauseIndex + 1}
          </span>
        </mark>
      );

      cursor = marker.end;
    });

    // Remainder of text
    if (cursor < text.length) {
      elements.push(
        <span key={`plain-end`}>
          {highlightSearchTerms(text.substring(cursor), searchTerm)}
        </span>
      );
    }

    return elements;
  };

  const highlightSearchTerms = (content: string, query: string) => {
    if (!query.trim()) return content;
    const parts = content.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-300 text-black font-semibold rounded-xs px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Viewer Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold max-w-[200px] sm:max-w-xs truncate" title={fileName}>
            {fileName || 'Contract Document'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Document In-Text Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-28 sm:w-36"
            />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Decrease font size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-500">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(20, prev + 1))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Increase font size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between bg-slate-50/40 dark:bg-slate-900/50">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Severity Highlights:</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-400 dark:bg-red-600"></span>
            <span className="text-slate-700 dark:text-slate-300">Critical / High</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 dark:bg-amber-600"></span>
            <span className="text-slate-700 dark:text-slate-300">Medium</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 dark:bg-emerald-600"></span>
            <span className="text-slate-700 dark:text-slate-300">Low</span>
          </span>
        </div>
        <span className="text-slate-400 hidden sm:inline">Click any highlighted clause to view details</span>
      </div>

      {/* Main Document Content Container */}
      <div
        ref={containerRef}
        className="flex-1 p-6 sm:p-8 overflow-y-auto leading-relaxed font-serif select-text whitespace-pre-wrap text-slate-800 dark:text-slate-200"
        style={{ fontSize: `${fontSize}px` }}
      >
        {renderHighlightedDocument()}
      </div>
    </div>
  );
}
