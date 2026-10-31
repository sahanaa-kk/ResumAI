import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { FileText, Sparkles, User as UserIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, logout, openAuth } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-slate-900">ResumAI</span>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">ATS Pro</span>
          </div>
        </div>

        {/* Zone 2: 4-5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              currentView === 'landing' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              currentView === 'upload' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Upload Resume
          </button>
          <button
            onClick={() => onNavigate('job-match')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              currentView === 'job-match' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Job Matcher
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              currentView === 'dashboard' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              currentView === 'history' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            History
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                title="Account Settings"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-medium max-w-[120px] truncate">{user.name}</span>
              </button>
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('login')}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('upload')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
