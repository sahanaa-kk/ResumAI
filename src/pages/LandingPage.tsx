import React from 'react';
import {
  FileCheck,
  Sparkles,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Search,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge.tsx';

interface LandingPageProps {
  onStartUpload: () => void;
  onOpenSample: (sampleId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartUpload, onOpenSample }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="text-indigo-600 font-semibold">Gemini 3.8 Intelligence</span>
                <span aria-hidden="true">·</span>
                <span>Applicant Tracking System (ATS) Engine</span>
                <span aria-hidden="true">·</span>
                <span>Job Compatibility Matcher</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight text-balance leading-[1.12]">
                Diagnose, Optimize & Shortlist Your Resume with AI
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Over 75% of resumes are rejected by ATS filters before a recruiter ever reads them.
                ResumAI analyzes your resume for keyword density, structural parsing, action verb impact,
                and exact compatibility with any job description.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartUpload}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center gap-2 text-base whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze Your Resume Now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => onOpenSample('sample-software-engineer')}
                  className="px-5 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all text-sm whitespace-nowrap shrink-0"
                >
                  Try Preloaded Demo Resume
                </button>
              </div>

              {/* Supported formats & trust markers */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Supports PDF & DOCX</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant ATS Checklist</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Google XYZ Bullet Rewrites</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Diagnostic Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Live Resume Diagnostic</h2>
                    <p className="text-xs text-slate-500">Alex Rivera · Senior Full Stack Engineer</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    ATS Pass: 89%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center border border-slate-100">
                    <ScoreGauge score={88} size="sm" label="Overall Score" subtitle="Top 10% tier" />
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center border border-slate-100">
                    <ScoreGauge score={92} size="sm" label="ATS Friendly" subtitle="Zero parse errors" />
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/60 text-indigo-900">
                    <span className="font-medium">Identified Technical Skills</span>
                    <span className="font-bold tabular-nums">24 Found</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 text-emerald-900">
                    <span className="font-medium">Measurable Impact Bullets</span>
                    <span className="font-bold tabular-nums">8/9 Optimized</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 text-amber-900">
                    <span className="font-medium">Missing Target Keywords</span>
                    <span className="font-bold tabular-nums">3 Recommended</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenSample('sample-software-engineer')}
                    className="w-full py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center"
                  >
                    View Full Interactive Analysis Report →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Enterprise-Grade Evaluation Modules
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Designed according to modern recruiting guidelines and major corporate ATS algorithms (Workday, Taleo, Greenhouse, Lever).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                1. Comprehensive Resume Health Audit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates skills, experience progression, education alignment, project relevance, and grammar. Identifies vague bullet points and quantifies achievements with measurable metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                2. ATS Parsing & Structure Scrutiny
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Audits document structure, standard headings, column issues, and font scanability. Ensures automated parsers never discard your application due to unreadable layout formatting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                3. Precise Job Description Matcher
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste any job vacancy description. ResumAI checks matching skills, highlights critical missing keywords, and drafts a customized executive summary tailored directly to that role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After Transformation Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Transform Weak Bullets Into High-Impact Achievements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              ResumAI rewrites passive tasks using Google's proven XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Before */}
            <div className="p-6 rounded-xl bg-white border border-rose-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Before Optimization
                </span>
                <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  Weak & Passive
                </span>
              </div>
              <p className="text-sm text-slate-700 italic">
                "Worked on the company web application and helped make the dashboard faster for users."
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                Lacks quantifiable data, lacks specific tools, uses passive verbs ("worked on", "helped").
              </div>
            </div>

            {/* After */}
            <div className="p-6 rounded-xl bg-white border border-emerald-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  After ResumAI Optimization
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Executive Standard
                </span>
              </div>
              <p className="text-sm text-slate-900 font-medium">
                "Architected a responsive analytics dashboard in React & TypeScript for 120K+ daily users, optimizing database queries to reduce API latency by 42%."
              </p>
              <div className="text-xs text-emerald-700 pt-2 border-t border-slate-100 font-medium">
                Active power verb ("Architected"), clear scale (120K users), concrete metric (42% latency reduction).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preloaded Demo Profiles CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Test With Ready-Made Sample Profiles
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
            Don't have a resume file on hand right now? Click any candidate archetype below to see a complete live evaluation immediately.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => onOpenSample('sample-software-engineer')}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all group"
            >
              <div className="text-xs font-semibold text-indigo-600 mb-1">Engineering</div>
              <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                Full Stack Developer
              </div>
              <div className="text-xs text-slate-500 mt-1">4 yrs experience · React, Node, AWS</div>
            </button>

            <button
              onClick={() => onOpenSample('sample-student-fresher')}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all group"
            >
              <div className="text-xs font-semibold text-emerald-600 mb-1">Fresher / Graduate</div>
              <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                Entry-Level CS Graduate
              </div>
              <div className="text-xs text-slate-500 mt-1">0 yrs experience · Projects & Degree</div>
            </button>

            <button
              onClick={() => onOpenSample('sample-product-manager')}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all group"
            >
              <div className="text-xs font-semibold text-purple-600 mb-1">Product & Strategy</div>
              <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                Product Manager (SaaS)
              </div>
              <div className="text-xs text-slate-500 mt-1">3.5 yrs experience · B2B, Metrics</div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">ResumAI</span>
            <span>·</span>
            <span>AI-Powered Resume & ATS Intelligence</span>
          </div>
          <div className="text-slate-500">
            Engineered with Google Gemini 3.8 & Modern ATS Standards
          </div>
        </div>
      </footer>
    </div>
  );
};
