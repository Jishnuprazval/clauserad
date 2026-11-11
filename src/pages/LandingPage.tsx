import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Scale,
  Sparkles,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
  Home,
  FileCheck,
  Lock,
  Layers,
  Search,
} from 'lucide-react';
import { RiskScoreBadge } from '../components/RiskScoreBadge';

export function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can ClauseRadar detect unfair service bonds and exit penalties in employment agreements?',
      a: 'Yes! ClauseRadar has specialized detection rules for mandatory service bonds, liquidated damages clauses, and excessive training cost repayment penalties that frequently trap students and first-time job seekers.',
    },
    {
      q: 'How does the 0-100 Risk Scoring system work?',
      a: 'Every evaluated clause carries a severity weight (Critical: 10 pts, High: 8 pts, Medium: 5 pts, Low: 2 pts). The score is calculated as a normalized percentage of detected risk factors, categorizing agreements as Low Risk (0–24), Moderate Risk (25–49), High Risk (50–74), or Very High Risk (75–100).',
    },
    {
      q: 'Does ClauseRadar work if the Gemini AI service is temporarily unavailable?',
      a: 'Absolutely. ClauseRadar is built with a self-sufficient, deterministic rule-based contract detection engine that operates 100% locally in the backend without depending on third-party AI for detection. When available, Gemini augments the report with enhanced plain-English translations and counter-proposals.',
    },
    {
      q: 'Are my uploaded contract documents kept private and secure?',
      a: 'Yes. Files are stored with authenticated user ownership barriers and are never exposed as publicly accessible static assets. Your data is never sold or used for public training datasets.',
    },
    {
      q: 'Does ClauseRadar replace a licensed lawyer?',
      a: 'No. ClauseRadar provides automated heuristic screening and educational explanations designed to flag red flags and suggest questions. It is an educational tool and does not provide formal legal representation or legal counsel.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/60 via-indigo-50/30 to-transparent dark:from-blue-950/20 dark:via-indigo-950/10 pointer-events-none blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 text-xs font-bold tracking-wide uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              Empowering Students & Freelancers
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Understand Every Clause{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
                Before You Sign.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Analyze contracts, identify hidden risks, and make smarter decisions with ClauseRadar. Detect 2-year service bonds, 90-day notice traps, wage deductions, and non-competes in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/analyze"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base group"
              >
                <span>Analyze Your Contract</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  navigate('/analyze?demo=true');
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-base shadow-xs"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Try Demo Agreement</span>
              </button>
            </div>

            {/* Quick stats / trust points */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>10 Specialized Detection Rules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Plain-English Legal Translations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Risk Score (0–100)</span>
              </div>
            </div>
          </div>

          {/* Interactive Contract Analysis Preview Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Window chrome */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 ml-2">
                  Apex_Internship_Offer.pdf — ClauseRadar Live Screening
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  Risk Score: 85/100 (Very High)
                </span>
              </div>
            </div>

            {/* Mock split preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[320px]">
              {/* Document side */}
              <div className="md:col-span-7 p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 font-mono text-xs leading-relaxed space-y-4 text-slate-700 dark:text-slate-300">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Document Section: Retention & Termination
                </div>
                <p>
                  1. The Employee agrees to a mandatory retention commitment of twenty-four (24) months. Should the Employee resign for any reason prior to completing this term...
                </p>
                <div className="p-2.5 rounded-lg bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-200 border-l-4 border-l-red-600 font-semibold">
                  [#1 FLAG] ...the Employee shall immediately pay the Company a liquidated damages and training reimbursement fee of $3,500 within seven (7) business days.
                </div>
                <p>
                  2. During employment, the Employee must provide a mandatory ninety (90) days written notice prior to resignation...
                </p>
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border-l-4 border-l-amber-500">
                  [#2 FLAG] ...The Company reserves the unilateral right to amend, alter, or decrease compensation tiers at any time without prior consultation.
                </div>
              </div>

              {/* Analysis insights side */}
              <div className="md:col-span-5 p-6 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Detected Risk Analysis
                  </span>
                  <RiskScoreBadge severity="Critical" size="sm" />
                </div>

                <div className="rounded-xl border border-red-200 dark:border-red-900/60 p-4 bg-red-50/50 dark:bg-red-950/20 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Service Bond & Exit Penalty
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-800 dark:text-slate-200">Plain English:</strong> You are locked in for 2 years and forced to pay $3,500 if you quit early, even for unfair working conditions.
                  </p>
                  <div className="pt-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                    <span>Negotiation tip: Request removal of early exit damages.</span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 p-4 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Unilateral Modification Clause
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-800 dark:text-slate-200">Plain English:</strong> The employer can cut your stipend or alter hours whenever they want without your consent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences / Benefits */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Who ClauseRadar Protects
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for Those Most Vulnerable to Predatory Terms
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                Students & First-Time Job Seekers
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Avoid signing hidden 2-year service bonds, 90-day lock-in periods, or surprise "training expense" penalties in your first job offer.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                Freelancers & Independent Contractors
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Spot predatory clauses claiming 100% ownership over your personal off-hours code, broad indemnification traps, and unpaid payment withholdings.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Home className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                Tenants & Renters
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Highlight automatic renewal traps, arbitrary landlord fee increases, excessive maintenance liabilities, and deposit forfeiture clauses before signing leases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Step-by-Step Workflow
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            From Raw PDF to Crystal-Clear Risk Report
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="rounded-2xl p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center mb-5 text-sm">
              01
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Upload PDF or Paste Text
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Drag and drop any PDF agreement or paste raw clause text. Choose contract category (Internship, Employment, Rental, Freelance).
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center mb-5 text-sm">
              02
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Heuristic & AI Screening
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our 10-category rule engine inspects the document for red flags while optional Gemini AI translates legal jargon into simple English.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center mb-5 text-sm">
              03
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Review, Highlight & Negotiate
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore highlighted clauses directly on the original document, view your 0–100 risk score, and copy ready-made counter-proposals.
            </p>
          </div>
        </div>
      </section>

      {/* 10 Detection Rules Grid */}
      <section id="features" className="py-20 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Comprehensive Coverage
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              The 10 Risky Clause Categories We Screen
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Service Bonds & Penalties',
                sev: 'Critical',
                desc: 'Mandatory retention agreements requiring monetary repayment or training fee reimbursements for early resignation.',
              },
              {
                title: 'Salary Deductions & Withholding',
                sev: 'Critical',
                desc: 'Arbitrary management deductions for damage, mistakes, or forfeiture of earned compensation.',
              },
              {
                title: 'Non-Compete Restrictions',
                sev: 'High',
                desc: 'Restrictive post-employment terms barring you from working for competitors or in your local industry.',
              },
              {
                title: 'Unpaid Notice Periods',
                sev: 'High',
                desc: 'Excessive 90-day notice periods, prohibition of early exit, or termination without salary in lieu.',
              },
              {
                title: 'Unilateral Modification',
                sev: 'High',
                desc: 'Clauses allowing one party to alter pay, duties, or policies at their sole discretion without your consent.',
              },
              {
                title: 'Broad Intellectual Property',
                sev: 'High',
                desc: 'Surrendering ownership of personal inventions, off-duty side projects, or prior creations.',
              },
              {
                title: 'Termination Restrictions',
                sev: 'High',
                desc: 'Preventing voluntary resignation without board consent or creating non-reciprocal exit rights.',
              },
              {
                title: 'Liability & Indemnification',
                sev: 'Medium',
                desc: 'Unlimited personal liability and one-sided indemnity clauses for employer losses or legal fees.',
              },
              {
                title: 'Automatic Renewal Clauses',
                sev: 'Medium',
                desc: 'Evergreen agreements that renew automatically without sufficient advance notice.',
              },
              {
                title: 'Data Sharing & Surveillance',
                sev: 'Medium',
                desc: 'Invasive monitoring of personal devices or sharing user information with commercial marketing brokers.',
              },
            ].map((rule, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">Rule 0{idx + 1}</span>
                  <RiskScoreBadge severity={rule.sev} size="sm" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">{rule.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Got Questions?
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-slate-900 dark:text-white flex items-center justify-between text-base"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Check Your Agreement Before Signing?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-base sm:text-lg">
            Upload your PDF or try our pre-packaged internship sample with 5 high-risk clauses in under 10 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/analyze"
              className="px-8 py-3.5 rounded-xl font-bold text-blue-700 bg-white hover:bg-blue-50 shadow-lg shadow-black/10 transition-all text-base"
            >
              Start Free Analysis
            </Link>
            <button
              onClick={() => navigate('/analyze?demo=true')}
              className="px-7 py-3.5 rounded-xl font-semibold text-white bg-blue-800/60 hover:bg-blue-800/90 border border-white/20 transition-all text-base"
            >
              Load Demo Agreement
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
