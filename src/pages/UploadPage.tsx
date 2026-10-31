import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  Sparkles,
  CheckCircle,
  FileCode,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { ResumeAnalysisResult } from '../types/index.ts';
import { SAMPLE_RESUMES, SampleResume } from '../server/samples.ts';

interface UploadPageProps {
  onAnalysisComplete: (result: ResumeAnalysisResult) => void;
  preselectedSampleId?: string | null;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  onAnalysisComplete,
  preselectedSampleId,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [stats, setStats] = useState<{ wordCount: number; charCount: number; pageEstimate: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If a sample was passed from landing page, preload it
  useEffect(() => {
    if (preselectedSampleId) {
      const sample = SAMPLE_RESUMES.find((s) => s.id === preselectedSampleId);
      if (sample) {
        loadSampleResume(sample);
      }
    }
  }, [preselectedSampleId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (selectedFile: File) => {
    setError(null);
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const hasValidExt = validExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt) {
      setError('Invalid file format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setIsUploading(true);

    try {
      const res = await api.uploadFile(selectedFile);
      setResumeText(res.extractedText);
      setStats(res.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from resume file.');
    } finally {
      setIsUploading(false);
    }
  };

  const loadSampleResume = (sample: SampleResume) => {
    setError(null);
    setFileName(`${sample.title}.pdf`);
    setResumeText(sample.content);
    setTargetRole(sample.role);
    const words = sample.content.split(/\s+/).filter(Boolean).length;
    setStats({
      wordCount: words,
      charCount: sample.content.length,
      pageEstimate: Math.max(1, Math.ceil(words / 450)),
    });
  };

  const handleStartAnalysis = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError('Resume content is too short or empty. Please upload or paste a complete resume.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    // Multi-phase progress indicator
    setAnalysisStep('Initializing Gemini 3.8 Flash model...');
    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('Evaluating ATS parsing rules & keyword density...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('Auditing experience bullet points with Google XYZ formula...');
    }, 2800);

    const stepTimer3 = setTimeout(() => {
      setAnalysisStep('Identifying missing skills and drafting tailored improvements...');
    }, 4500);

    try {
      const result = await api.analyzeResume({
        resumeText,
        fileName: fileName || 'Uploaded Resume',
        targetRole: targetRole || undefined,
      });

      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || 'AI resume analysis encountered an error. Please try again.');
      setIsAnalyzing(false);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
          <span>ResumAI Studio</span>
          <span aria-hidden="true">·</span>
          <span>Resume Ingestion & Parsing</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Upload & Inspect Resume
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Upload your resume in PDF or DOCX format. Our server extracts the raw textual hierarchy,
          validates structure, and submits it to Google Gemini for exhaustive evaluation.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Quick Sample Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Quick Start with Sample Resumes</span>
          </div>
          <span className="text-xs text-slate-500">1-Click Pre-fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_RESUMES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSampleResume(sample)}
              className="px-3.5 py-2.5 text-left border border-slate-200 hover:border-indigo-500 rounded-lg bg-slate-50/70 hover:bg-indigo-50/40 transition-colors text-xs"
            >
              <div className="font-semibold text-slate-800">{sample.title}</div>
              <div className="text-slate-500 mt-0.5">{sample.candidateName} · {sample.experienceLevel}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop File Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/50 scale-[1.005]'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <p className="text-base font-semibold text-slate-800">
              {isUploading ? (
                'Extracting resume text...'
              ) : (
                <>
                  <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supported formats: PDF, DOCX, TXT (Maximum file size: 10MB)
            </p>
          </div>

          {fileName && !isUploading && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Loaded: {fileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Manual Paste / Type Trigger if not already shown */}
      {!resumeText && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setResumeText(' ')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5 mx-auto"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Or paste / write resume text directly into editor</span>
          </button>
        </div>
      )}

      {/* Target Role & Extracted Content Inspector */}
      {(resumeText !== '' || error) && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Job Title / Career Goal (Optional)
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer / Frontend Lead"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Helps Gemini benchmark your skills against industry expectations.
              </p>
            </div>

            {stats && (
              <div className="flex items-center justify-around bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="text-center">
                  <div className="text-lg font-bold tabular-nums text-slate-800">
                    {stats.wordCount}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase font-medium">Words</div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <div className="text-lg font-bold tabular-nums text-slate-800">
                    {stats.charCount}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase font-medium">Characters</div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <div className="text-lg font-bold tabular-nums text-slate-800">
                    ~{stats.pageEstimate}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase font-medium">Est. Pages</div>
                </div>
              </div>
            )}
          </div>

          {/* Extracted Text Inspector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Extracted Resume Content (Editable)
              </label>
              <span className="text-[11px] text-slate-500">
                You can edit or paste extra sections before running analysis
              </span>
            </div>
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                const words = e.target.value.split(/\s+/).filter(Boolean).length;
                setStats({
                  wordCount: words,
                  charCount: e.target.value.length,
                  pageEstimate: Math.max(1, Math.ceil(words / 450)),
                });
              }}
              className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white leading-relaxed resize-y"
            />
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Analysis takes 4–6 seconds using Gemini 3.8 Flash model</span>
            </div>

            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 text-sm disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Resume Analysis</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

          {/* Live Progress Banner during analysis */}
          {isAnalyzing && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl animate-pulse flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <div className="text-xs font-medium text-indigo-900">
                {analysisStep || 'Analyzing resume structure with Gemini...'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
