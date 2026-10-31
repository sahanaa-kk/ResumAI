import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { ResumeAnalysisResult } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ScoreGauge } from '../components/ScoreGauge.tsx';
import {
  FileText,
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  Upload,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateToUpload: () => void;
  onNavigateToJobMatch: () => void;
  onSelectAnalysis: (analysis: ResumeAnalysisResult) => void;
  onOpenSample: (sampleId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToUpload,
  onNavigateToJobMatch,
  onSelectAnalysis,
  onOpenSample,
}) => {
  const { user, openAuth } = useAuth();
  const [analyses, setAnalyses] = useState<ResumeAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const data = await api.getAnalyses();
        setAnalyses(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchAnalyses();
  }, []);

  const latestAnalysis = analyses[0] || null;

  // Aggregate stats
  const averageOverallScore = analyses.length
    ? Math.round(analyses.reduce((acc, a) => acc + a.overallScore, 0) / analyses.length)
    : 0;

  const averageAtsScore = analyses.length
    ? Math.round(analyses.reduce((acc, a) => acc + a.atsScore, 0) / analyses.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Career Command Center</span>
            <span aria-hidden="true">·</span>
            <span>{user ? user.email : 'Guest Session'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user ? user.name : 'Job Seeker'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Targeting:{' '}
            <span className="font-semibold text-indigo-600">
              {user?.targetRole || latestAnalysis?.candidateInfo.targetRoleDetected || 'Software & Tech Roles'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToUpload}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Upload className="w-4 h-4" />
            Upload New Resume
          </button>
        </div>
      </div>

      {/* If No Analyses Yet: Empty State */}
      {!loading && analyses.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Resume Evaluated Yet</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Upload your resume or pick from our ready-made sample profiles to see your comprehensive ATS score, skill analysis, and Google XYZ bullet rewrites.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToUpload}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm text-xs transition-colors"
            >
              Upload Your Resume (PDF/DOCX)
            </button>
            <button
              onClick={() => onOpenSample('sample-software-engineer')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
            >
              Test Preloaded Profile
            </button>
          </div>
        </div>
      )}

      {/* Aggregate Score Deck */}
      {latestAnalysis && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <ScoreGauge
                score={latestAnalysis.overallScore}
                size="md"
                label="Latest Resume Score"
                subtitle={latestAnalysis.overallScore >= 80 ? 'Competitive' : 'Room to Grow'}
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <ScoreGauge
                score={latestAnalysis.atsScore}
                size="md"
                label="ATS Compliance"
                subtitle="Parsed Structure"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <span>Identified Skills</span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-3xl font-extrabold tabular-nums text-slate-900">
                  {latestAnalysis.technicalSkills.length + latestAnalysis.softSkills.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {latestAnalysis.technicalSkills.length} Technical · {latestAnalysis.softSkills.length} Soft Skills
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-medium">
                {latestAnalysis.missingSkillsForRole.length} High-value skills recommended
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <span>Evaluated Documents</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-3xl font-extrabold tabular-nums text-slate-900">
                  {analyses.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Average Overall Score: {averageOverallScore}%
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                Average ATS Pass: {averageAtsScore}%
              </div>
            </div>
          </div>

          {/* Quick Spotlight on Latest Analysis */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Current Active Evaluation
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {latestAnalysis.candidateInfo.fullName} · {latestAnalysis.resumeFileName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectAnalysis(latestAnalysis)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Open Full Diagnostic</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onNavigateToJobMatch}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Match with JD</span>
                </button>
              </div>
            </div>

            {/* Strengths & Weaknesses quick preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Key Strength Highlight</span>
                </div>
                <p className="text-slate-800 leading-relaxed">
                  {latestAnalysis.keyStrengths[0] || 'Clean structured technical skills inventory.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
                <div className="font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Key Improvement Priority</span>
                </div>
                <p className="text-slate-800 leading-relaxed">
                  {latestAnalysis.criticalWeaknesses[0] || 'Add quantified metrics to your bullet points.'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Evaluations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Analysis History</h3>
              <span className="text-xs text-slate-500">{analyses.length} total runs</span>
            </div>

            <div className="divide-y divide-slate-100">
              {analyses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectAnalysis(item)}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {item.candidateInfo.fullName || item.resumeFileName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.candidateInfo.targetRoleDetected || 'Target Role'} · {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums text-slate-900">
                        {item.overallScore}/100
                      </div>
                      <div className="text-[11px] text-slate-400">Overall</div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold tabular-nums text-emerald-600">
                        {item.atsScore}%
                      </div>
                      <div className="text-[11px] text-slate-400">ATS Pass</div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
