import React from 'react';
import { ShieldAlert, AlertTriangle, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">ClauseRadar</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated contract risk detection and plain-English analysis designed for students, freelancers, first-time job seekers, and tenants.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/analyze" className="hover:text-white transition-colors">Analyze Contract</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">Analysis History</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">Contract Comparison</Link>
              </li>
            </ul>
          </div>

          {/* Supported Contracts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Supported Contracts</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Internship Offer Letters</li>
              <li>Employment Agreements</li>
              <li>Freelance & Service SOWs</li>
              <li>Residential Lease & Rental</li>
              <li>Non-Disclosure Agreements</li>
              <li>Software Terms of Service</li>
            </ul>
          </div>

          {/* Screened Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Detected Red Flags</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Service Bonds & Exit Fees
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Non-Compete Clauses
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Discretionary Salary Deductions
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 90-Day Unpaid Notice Periods
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Unilateral Terms Modification
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-white">Legal Information Disclaimer: </span>
              <span>
                ClauseRadar provides automated heuristic screening, natural language pattern matching, and plain-English educational explanations. ClauseRadar is not a law firm, does not provide legal representation, and does not create an attorney-client relationship. Risk scores and highlighted issues are indicative screening aids only. Always seek independent counsel from a licensed attorney for formal legal review.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ClauseRadar. Built for student and freelancer empowerment.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Use</span>
            <span className="hover:text-slate-400">Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
