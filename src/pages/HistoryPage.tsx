import React, { useState, useEffect } from 'react';
import { ResumeAnalysisResult } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  FileText,
  Trash2,
  ChevronRight,
  Sparkles,
  Search,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface HistoryPageProps {
  onSelectAnalysis: (analysis: ResumeAnalysisResult) => void;
  onNavigateToUpload: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectAnalysis,
  onNavigateToUpload,
}) => {
  const [analyses, setAnalyses] = useState<ResumeAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await api.getAnalyses();
      setAnalyses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this resume evaluation?')) return;
    try {
      await api.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const filtered = analyses.filter(
    (a) =>
      a.candidateInfo.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.resumeFileName.toLowerCase().includes(search.toLowerCase()) ||
      a.candidateInfo.targetRoleDetected.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Historical Records</span>
            <span aria-hidden="true">·</span>
            <span>Saved Resume Audits</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            View, review, and compare your previous resume diagnostic reports.
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          New Resume Analysis
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      {analyses.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by candidate name, role, or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          Loading historical analyses...
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No evaluations saved</h3>
          <p className="text-xs text-slate-500">
            Upload and analyze your first resume to see it tracked here.
          </p>
          <button
            onClick={onNavigateToUpload}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
          >
            Upload Resume
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item)}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {item.candidateInfo.fullName || item.resumeFileName}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                    <span className="font-medium text-indigo-600">
                      {item.candidateInfo.targetRoleDetected || 'General Professional'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.resumeFileName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="text-right">
                  <span className="text-base font-bold tabular-nums text-slate-900">
                    {item.overallScore}
                  </span>
                  <span className="text-xs text-slate-400">/100</span>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    Overall
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold tabular-nums text-emerald-600">
                    {item.atsScore}%
                  </span>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    ATS Pass
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No analyses matching "{search}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
