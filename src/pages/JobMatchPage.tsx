import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Briefcase,
  FileText,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge.tsx';
import { api } from '../services/api.ts';
import { ResumeAnalysisResult, JobMatchResult } from '../types/index.ts';
import { SAMPLE_JOBS, SampleJob } from '../server/samples.ts';

interface JobMatchPageProps {
  currentAnalysis: ResumeAnalysisResult | null;
  onNavigateToUpload: () => void;
}

export const JobMatchPage: React.FC<JobMatchPageProps> = ({
  currentAnalysis,
  onNavigateToUpload,
}) => {
  const [jobTitle, setJobTitle] = useState('Senior Frontend Engineer');
  const [company, setCompany] = useState('FinTech Velocity');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState(currentAnalysis?.extractedResumeText || '');
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Sync if currentAnalysis updates
  useEffect(() => {
    if (currentAnalysis?.extractedResumeText && !resumeText) {
      setResumeText(currentAnalysis.extractedResumeText);
    }
  }, [currentAnalysis]);

  // Pre-load the first sample job by default for immediate convenience
  useEffect(() => {
    if (!jobDescription && SAMPLE_JOBS.length > 0) {
      loadSampleJob(SAMPLE_JOBS[0]);
    }
  }, []);

  const loadSampleJob = (job: SampleJob) => {
    setJobTitle(job.title);
    setCompany(job.company);
    setJobDescription(job.description);
    setMatchResult(null);
  };

  const handleRunMatch = async () => {
    if (!resumeText.trim()) {
      setError('Please provide a resume text to compare against the job posting.');
      return;
    }
    if (!jobDescription.trim() || !jobTitle.trim()) {
      setError('Please provide a job title and description.');
      return;
    }

    setError(null);
    setIsMatching(true);

    try {
      const result = await api.matchJob({
        resumeText,
        jobDescription,
        jobTitle,
        company,
        analysisId: currentAnalysis?.id,
      });
      setMatchResult(result);
    } catch (err: any) {
      setError(err.message || 'Job description matching encountered an error.');
    } finally {
      setIsMatching(false);
    }
  };

  const handleCopyTailoredSummary = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
          <span>ResumAI Matcher</span>
          <span aria-hidden="true">·</span>
          <span>Job Description Compatibility & Gap Analysis</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Job Description Matcher
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Evaluate how closely your resume aligns with an employer's specific job posting.
          Uncover missing technical requirements, critical ATS keywords, and receive a tailored executive summary.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Pre-fill Sample Job Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-600" />
            Quick-Fill Sample Job Postings
          </span>
          <span className="text-xs text-slate-500">Click to load</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_JOBS.map((job) => (
            <button
              key={job.id}
              onClick={() => loadSampleJob(job)}
              className="px-3.5 py-2.5 text-left border border-slate-200 hover:border-indigo-500 rounded-lg bg-slate-50/70 hover:bg-indigo-50/40 transition-colors text-xs"
            >
              <div className="font-semibold text-slate-800">{job.title}</div>
              <div className="text-slate-500 mt-0.5">{job.company} · {job.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Job Description Input */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Target Job Posting Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe / Linear"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paste Complete Job Description
            </label>
            <textarea
              rows={9}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste requirements, responsibilities, and qualifications..."
              className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-y"
            />
          </div>
        </div>

        {/* Right Column: Candidate Resume Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Candidate Resume Content</h3>
              </div>
              {!currentAnalysis && (
                <button
                  onClick={onNavigateToUpload}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Upload File Instead
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resume Text (Pre-filled from uploaded document or editable)
              </label>
              <textarea
                rows={11}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste or inspect the resume text to be compared against the JD..."
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-y"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRunMatch}
              disabled={isMatching}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isMatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing JD Alignment & Keyword Overlap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Calculate Job Match & Identify Gaps</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Matching Results Deck */}
      {matchResult && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <ScoreGauge
                score={matchResult.matchScore}
                size="lg"
                label="Compatibility Score"
                subtitle={matchResult.verdict}
              />
            </div>

            {/* Verdict & Analysis */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Alignment with {matchResult.jobTitle}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {matchResult.company ? `Target: ${matchResult.company}` : 'Standard Profile'}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100">
                  {matchResult.verdict}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {matchResult.experienceMatchAnalysis}
              </p>
            </div>
          </div>

          {/* Skills & Keywords Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matching Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Matching Skills ({matchResult.matchingSkills.length})
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                Skills found in your resume that directly answer requirements in this job posting:
              </p>
              <div className="flex flex-wrap gap-2">
                {matchResult.matchingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md"
                  >
                    ✓ {skill}
                  </span>
                ))}
                {matchResult.matchingSkills.length === 0 && (
                  <span className="text-xs text-slate-500 italic">No direct matches detected.</span>
                )}
              </div>

              {/* Matched Keywords */}
              {matchResult.matchedKeywords.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Matched Domain Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchedKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-medium text-slate-700 bg-slate-100 rounded"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Missing Skills & Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-rose-700">
                <XCircle className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Missing Skills ({matchResult.missingSkills.length})
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                Crucial qualifications requested by the job posting that are currently absent from your resume:
              </p>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-md"
                  >
                    ! {skill}
                  </span>
                ))}
              </div>

              {/* Missing Keywords */}
              {matchResult.missingKeywords.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Missing ATS Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tailored Summary for this specific job */}
          {matchResult.tailoredSummarySuggestion && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    Tailored Professional Summary for this Role
                  </h4>
                </div>
                <button
                  onClick={() =>
                    handleCopyTailoredSummary(matchResult.tailoredSummarySuggestion)
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
                      <span>Copy Tailored Summary</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Substitute your current professional summary with this version when submitting for this specific vacancy:
              </p>
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-900 leading-relaxed font-medium">
                "{matchResult.tailoredSummarySuggestion}"
              </div>
            </div>
          )}

          {/* Section Tailoring Recommendations */}
          {matchResult.topTailoringPoints.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm">
                Specific Section-by-Section Tailoring Directives
              </h4>
              <div className="space-y-3">
                {matchResult.topTailoringPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px]">
                      {point.section}
                    </span>
                    <p className="text-slate-800">{point.advice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
