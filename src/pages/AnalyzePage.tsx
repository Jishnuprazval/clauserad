import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  FileCheck,
  X,
  AlertCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Sidebar } from '../components/Sidebar';

export function AnalyzePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [contractName, setContractName] = useState('');
  const [contractType, setContractType] = useState('Internship Offer Letter');
  const [contractText, setContractText] = useState('');

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Analysis status
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle demo query param auto-loader (?demo=true)
  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      loadSampleDemo();
    }
  }, [searchParams]);

  const loadSampleDemo = async () => {
    try {
      setError(null);
      const sample = await api.contracts.getSampleDemo();
      setInputMode('paste');
      setContractName(sample.contractName);
      setContractType(sample.contractType);
      setContractText(sample.contractText);
    } catch (err: any) {
      console.error('Failed to load sample demo:', err);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Unsupported file type. Please upload a PDF contract (.pdf).');
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit. Please upload a smaller PDF.');
      return;
    }
    setFile(f);
    if (!contractName) {
      setContractName(f.name.replace(/\.pdf$/i, ''));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (inputMode === 'upload' && !file) {
      setError('Please select or drag a PDF contract file to upload.');
      return;
    }

    if (inputMode === 'paste' && (!contractText || contractText.trim().length < 30)) {
      setError('Please paste contract text containing at least 30 characters.');
      return;
    }

    setAnalyzing(true);
    setUploadProgress(10);
    setAnalysisStep('Ingesting document and extracting textual clauses...');

    try {
      let analysisId = '';

      if (inputMode === 'upload' && file) {
        setUploadProgress(35);
        setAnalysisStep('Running PDF text layer parser & page chunking...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('contractName', contractName || file.name.replace(/\.pdf$/i, ''));
        formData.append('contractType', contractType);

        setTimeout(() => {
          setUploadProgress(65);
          setAnalysisStep('Executing 10-rule detection engine (Service bonds, non-competes, deductions)...');
        }, 600);

        setTimeout(() => {
          setUploadProgress(85);
          setAnalysisStep('Computing normalized risk score & plain-English translations...');
        }, 1200);

        const res = await api.contracts.uploadPdf(formData);
        analysisId = res.analysisId;
      } else {
        setUploadProgress(40);
        setAnalysisStep('Screening pasted clauses against 10 risk categories...');

        setTimeout(() => {
          setUploadProgress(75);
          setAnalysisStep('Synthesizing negotiation strategies & plain-English takeaways...');
        }, 700);

        const res = await api.contracts.analyzeText({
          contractName: contractName || 'Pasted ' + contractType,
          contractType,
          contractText,
        });
        analysisId = res.analysisId;
      }

      setUploadProgress(100);
      setAnalysisStep('Report ready! Navigating to risk analysis report...');

      setTimeout(() => {
        navigate(`/report/${analysisId}`);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during contract analysis.');
      setAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Analyze Contract Risk
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload your agreement to screen for predatory service bonds, non-competes, and wage clauses
            </p>
          </div>

          <button
            type="button"
            onClick={loadSampleDemo}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Load Demo Internship Sample</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Mode Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-2xl max-w-md">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              inputMode === 'upload'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('paste')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              inputMode === 'paste'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Text</span>
          </button>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleAnalyze}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6"
        >
          {/* Metadata Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Contract Name (Optional)
              </label>
              <input
                type="text"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder="e.g. Apex Software Internship Agreement"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Contract Category
              </label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="Internship Offer Letter">Internship Offer Letter</option>
                <option value="Employment Agreement">Employment Agreement</option>
                <option value="Rental Agreement">Rental Agreement</option>
                <option value="Freelance Contract">Freelance Contract</option>
                <option value="Service Agreement">Service Agreement</option>
                <option value="Terms of Service">Terms of Service</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Method 1: Upload PDF Area */}
          {inputMode === 'upload' ? (
            <div className="space-y-4">
              {!file ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Drag and drop your contract PDF here
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Accepts text-based PDF documents up to 15MB
                  </p>
                  <span className="inline-flex px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    Browse Files
                  </span>
                </div>
              ) : (
                <div className="rounded-2xl p-5 border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {file.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {formatFileSize(file.size)} • PDF Ready
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Method 2: Paste Contract Text */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Contract Text / Clause Excerpt
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400">
                    {contractText.length} characters
                  </span>
                  {contractText && (
                    <button
                      type="button"
                      onClick={() => setContractText('')}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Clear Text
                    </button>
                  )}
                </div>
              </div>
              <textarea
                rows={12}
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste the agreement terms, job offer clauses, or entire contract here..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-mono leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Analysis Progress Overlay / Indicator */}
          {analyzing && (
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>{analysisStep}</span>
                </div>
                <span className="font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500">
              * Operates deterministically via 10 configured rule definitions + optional Gemini AI enhancement.
            </div>

            <button
              type="submit"
              disabled={analyzing || (inputMode === 'upload' && !file) || (inputMode === 'paste' && !contractText.trim())}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {analyzing ? (
                <span>Analyzing Document...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Contract</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
