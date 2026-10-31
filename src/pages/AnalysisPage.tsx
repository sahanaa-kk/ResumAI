import React, { useState } from 'react';
import {
  ResumeAnalysisResult,
  GrammarItem,
  ExperienceItemAnalysis,
} from '../types/index.ts';
import { ScoreGauge } from '../components/ScoreGauge.tsx';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnalysisPageProps {
  analysis: ResumeAnalysisResult;
  onMatchWithJob: (analysis: ResumeAnalysisResult) => void;
  onNewUpload: () => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  analysis,
  onMatchWithJob,
  onNewUpload,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'skills' | 'experience' | 'ats' | 'improvements' | 'raw'
  >('overview');
  const [skillFilter, setSkillFilter] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Trigger celebration confetti if score is high
  React.useEffect(() => {
    if (analysis.overallScore >= 80) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  }, [analysis.id, analysis.overallScore]);

  const handleCopySummary = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadPDF = () => {
    // Uses the print engine with our bespoke print stylesheet
    window.print();
  };

  const filteredTechnicalSkills = analysis.technicalSkills.filter((s) =>
    s.toLowerCase().includes(skillFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Evaluated {new Date(analysis.createdAt).toLocaleDateString()}</span>
            <span aria-hidden="true">·</span>
            <span>{analysis.resumeFileName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-indigo-600">
              {analysis.candidateInfo.targetRoleDetected || 'Target Role'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span>{analysis.candidateInfo.fullName || 'Candidate Resume'}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {analysis.candidateInfo.experienceYears || 'Multi-Year Experience'}
            </span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 no-print">
          <button
            onClick={() => onMatchWithJob(analysis)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Match with Job Description
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors text-xs flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Report (PDF)
          </button>

          <button
            onClick={onNewUpload}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Upload Another
          </button>
        </div>
      </div>

      {/* Primary Score Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <ScoreGauge
            score={analysis.overallScore}
            size="lg"
            label="Overall Resume Score"
            subtitle={analysis.overallScore >= 80 ? 'Top Recruiter Tier' : 'Needs Optimization'}
          />
        </div>

        {/* ATS Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <ScoreGauge
            score={analysis.atsScore}
            size="lg"
            label="ATS Compatibility"
            subtitle={analysis.atsScore >= 75 ? 'Parses Cleanly' : 'Formatting Flags'}
          />
        </div>

        {/* Section Breakdown Radar */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Section Score Breakdown</h3>
            <span className="text-xs text-slate-500">Benchmark: 80+ is target</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Skills</div>
              <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                {analysis.sectionScores.skills}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${analysis.sectionScores.skills}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Experience</div>
              <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                {analysis.sectionScores.experience}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${analysis.sectionScores.experience}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Impact & Metrics</div>
              <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                {analysis.sectionScores.impactAndMetrics}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${analysis.sectionScores.impactAndMetrics}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Formatting</div>
              <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                {analysis.sectionScores.formatting}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${analysis.sectionScores.formatting}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Education</div>
              <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                {analysis.sectionScores.education}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full"
                  style={{ width: `${analysis.sectionScores.education}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Readability</div>
              <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                {analysis.sectionScores.readability}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full"
                  style={{ width: `${analysis.sectionScores.readability}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Navigation Tabs */}
      <div className="border-b border-slate-200 no-print">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-px">
          {[
            { id: 'overview', label: 'Strengths & Weaknesses' },
            { id: 'skills', label: 'Skills & Missing Gaps' },
            { id: 'experience', label: 'Work Experience & XYZ Rewrites' },
            { id: 'ats', label: 'ATS Checklist & Structure' },
            { id: 'improvements', label: 'AI Actionable Recommendations' },
            { id: 'raw', label: 'Extracted Resume Text' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview (Strengths & Critical Weaknesses) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-slate-900 text-sm">Top Resume Strengths</h3>
              </div>
              <div className="space-y-2.5">
                {analysis.keyStrengths.map((strength, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-slate-800 leading-relaxed"
                  >
                    {strength}
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-slate-900 text-sm">Critical Red Flags & Weaknesses</h3>
              </div>
              <div className="space-y-2.5">
                {analysis.criticalWeaknesses.map((weakness, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-xs text-slate-800 leading-relaxed"
                  >
                    {weakness}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education & Certifications Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700">
                  <GraduationCap className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 text-sm">Education Evaluation</h3>
                </div>
                <span className="text-xs font-bold tabular-nums text-slate-700">
                  {analysis.educationEvaluation.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysis.educationEvaluation.feedback}
              </p>
              {analysis.educationEvaluation.detectedDegrees.length > 0 && (
                <div className="text-xs text-slate-700 font-medium">
                  Detected:{' '}
                  <span className="font-normal text-slate-600">
                    {analysis.educationEvaluation.detectedDegrees.join(' · ')}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-700">
                  <Award className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 text-sm">Certifications & Accreditations</h3>
                </div>
                <span className="text-xs font-bold tabular-nums text-slate-700">
                  {analysis.certificationsEvaluation.score}/100
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-800">Detected: </span>
                  <span className="text-slate-600">
                    {analysis.certificationsEvaluation.detected.length > 0
                      ? analysis.certificationsEvaluation.detected.join(', ')
                      : 'None explicitly detected.'}
                  </span>
                </div>
                {analysis.certificationsEvaluation.recommendedToAcquire.length > 0 && (
                  <div>
                    <span className="font-semibold text-indigo-600">Recommended to acquire: </span>
                    <span className="text-slate-600">
                      {analysis.certificationsEvaluation.recommendedToAcquire.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skills & Missing Gaps */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Skill Inventory & Gap Analysis</h3>
              <p className="text-xs text-slate-500">
                Skills extracted by AI vs. high-demand industry skills that are currently absent.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter detected skills..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Missing Skills Warning Card */}
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Missing High-Value Skills for {analysis.candidateInfo.targetRoleDetected || 'Your Target Role'}
              </h4>
            </div>
            <p className="text-xs text-amber-900">
              Adding these in-demand competencies can boost candidate profile search rankings and interview callbacks:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {analysis.missingSkillsForRole.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-white border border-amber-300 rounded-md shadow-2xs"
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Technical & Domain Skills ({analysis.technicalSkills.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {filteredTechnicalSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg"
                >
                  {skill}
                </span>
              ))}
              {filteredTechnicalSkills.length === 0 && (
                <p className="text-xs text-slate-500 italic">No matching skills found.</p>
              )}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Leadership & Soft Skills ({analysis.softSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.softSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Work Experience & XYZ Rewrites */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Work Experience Audit</h3>
                <p className="text-xs text-slate-500">
                  Detailed evaluation of chronological roles, action verb density, and achievement quantification.
                </p>
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg tabular-nums">
                Score: {analysis.experienceEvaluation.score}/100
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {analysis.experienceEvaluation.feedback}
            </p>
          </div>

          {/* Roles Analyzed */}
          <div className="space-y-4">
            {analysis.experienceEvaluation.rolesAnalyzed.map((role, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{role.role}</h4>
                    <span className="text-xs font-semibold text-indigo-600">{role.company}</span>
                  </div>
                  {role.duration && (
                    <span className="text-xs text-slate-500 font-medium">{role.duration}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5">
                    <span className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider">
                      Role Strengths
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {role.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1.5">
                    <span className="font-bold text-amber-800 uppercase text-[10px] tracking-wider">
                      Opportunities for Improvement
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {role.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Google XYZ Formula Rewrite Suggestion */}
                {role.suggestedBulletRewrite && (
                  <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Google XYZ Formula Bullet Rewrite</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-rose-700">Original bullet: </span>
                        <span className="text-slate-600 italic">
                          "{role.suggestedBulletRewrite.original}"
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-indigo-200">
                        <span className="font-semibold text-emerald-700 block mb-1">
                          Recommended Executive Version:
                        </span>
                        <span className="text-slate-900 font-medium">
                          "{role.suggestedBulletRewrite.improved}"
                        </span>
                      </div>
                      <div className="text-[11px] text-indigo-800">
                        <span className="font-semibold">Why this works: </span>
                        {role.suggestedBulletRewrite.metricsAdded}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: ATS Checklist & Structure */}
      {activeTab === 'ats' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ATS (Applicant Tracking System) Readiness
                </h3>
                <p className="text-xs text-slate-500">
                  Simulated audit against enterprise recruitment filters (Workday, Taleo, Greenhouse).
                </p>
              </div>
              <div className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg tabular-nums">
                Compatibility: {analysis.atsScore}%
              </div>
            </div>

            {/* ATS Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.actionableImprovements.atsChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    item.passed
                      ? 'bg-emerald-50/40 border-emerald-100'
                      : 'bg-rose-50/40 border-rose-100'
                  } space-y-1.5`}
                >
                  <div className="flex items-center gap-2">
                    {item.passed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-900">{item.check}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6">{item.tip}</p>
                </div>
              ))}
            </div>

            {/* Formatting & Readability Specifics */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Formatting & Layout Analysis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                <div>
                  <span className="font-semibold block text-slate-900 mb-1">Bullet Point Rhythm</span>
                  <span>{analysis.formattingFeedback.bulletPointAnalysis}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-900 mb-1">Typography & Structure</span>
                  <span>{analysis.formattingFeedback.fontAndStructureAdvice}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-900 mb-1">Resume Length Advice</span>
                  <span>{analysis.formattingFeedback.lengthAdvice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Actionable Recommendations & Grammar */}
      {activeTab === 'improvements' && (
        <div className="space-y-6">
          {/* Improved Professional Summary */}
          {analysis.actionableImprovements.improvedProfessionalSummary && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    AI-Enhanced Professional Summary
                  </h3>
                </div>
                <button
                  onClick={() =>
                    handleCopySummary(
                      analysis.actionableImprovements.improvedProfessionalSummary
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                A magnetic 3-4 sentence elevator pitch written for maximum recruiter engagement and ATS keyword indexing:
              </p>
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-900 leading-relaxed font-medium">
                "{analysis.actionableImprovements.improvedProfessionalSummary}"
              </div>
            </div>
          )}

          {/* Strong Action Verbs to Use */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Recommended High-Impact Action Verbs
            </h3>
            <p className="text-xs text-slate-500">
              Replace passive words like "helped with" or "worked on" with these power verbs:
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.actionableImprovements.strongerActionVerbs.map((verb, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>

          {/* Measurable Metrics Tips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Quantifiable Impact Strategies
            </h3>
            <div className="space-y-2">
              {analysis.actionableImprovements.measurableMetricsTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5"
                >
                  <span className="font-bold text-indigo-600 shrink-0">0{idx + 1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar & Spelling Suggestions */}
          {analysis.grammarSuggestions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-700">
                <Edit3 className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Grammar, Spelling & Style Corrections ({analysis.grammarSuggestions.length})
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.grammarSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="line-through text-rose-600 font-medium">
                        "{item.original}"
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-emerald-700 font-bold">"{item.suggestion}"</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Raw Extracted Resume Content */}
      {activeTab === 'raw' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Extracted Plain Text Representation</h3>
            <span className="text-xs text-slate-500">
              {analysis.stats.wordCount} words · {analysis.stats.charCount} chars
            </span>
          </div>
          <pre className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
            {analysis.extractedResumeText}
          </pre>
        </div>
      )}
    </div>
  );
};
