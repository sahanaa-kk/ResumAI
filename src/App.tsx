import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { AuthModal } from './pages/AuthModal.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { UploadPage } from './pages/UploadPage.tsx';
import { AnalysisPage } from './pages/AnalysisPage.tsx';
import { JobMatchPage } from './pages/JobMatchPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { HistoryPage } from './pages/HistoryPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { ResumeAnalysisResult } from './types/index.ts';
import { api } from './services/api.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [preselectedSampleId, setPreselectedSampleId] = useState<string | null>(null);

  // Auto-fetch latest analysis if available on mount
  useEffect(() => {
    async function checkLatest() {
      try {
        const analyses = await api.getAnalyses();
        if (analyses.length > 0) {
          setCurrentAnalysis(analyses[0]);
        }
      } catch {
        // ignore
      }
    }
    checkLatest();
  }, []);

  const handleStartUpload = () => {
    setPreselectedSampleId(null);
    setCurrentView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSample = (sampleId: string) => {
    setPreselectedSampleId(sampleId);
    setCurrentView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = (result: ResumeAnalysisResult) => {
    setCurrentAnalysis(result);
    setCurrentView('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMatchWithJob = (analysis: ResumeAnalysisResult) => {
    setCurrentAnalysis(analysis);
    setCurrentView('job-match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnalysis = (analysis: ResumeAnalysisResult) => {
    setCurrentAnalysis(analysis);
    setCurrentView('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar currentView={currentView} onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />

        <main className="flex-1">
          {currentView === 'landing' && (
            <LandingPage
              onStartUpload={handleStartUpload}
              onOpenSample={handleOpenSample}
            />
          )}

          {currentView === 'upload' && (
            <UploadPage
              onAnalysisComplete={handleAnalysisComplete}
              preselectedSampleId={preselectedSampleId}
            />
          )}

          {currentView === 'analysis' && currentAnalysis && (
            <AnalysisPage
              analysis={currentAnalysis}
              onMatchWithJob={handleMatchWithJob}
              onNewUpload={handleStartUpload}
            />
          )}

          {currentView === 'analysis' && !currentAnalysis && (
            <UploadPage
              onAnalysisComplete={handleAnalysisComplete}
              preselectedSampleId="sample-software-engineer"
            />
          )}

          {currentView === 'job-match' && (
            <JobMatchPage
              currentAnalysis={currentAnalysis}
              onNavigateToUpload={handleStartUpload}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardPage
              onNavigateToUpload={handleStartUpload}
              onNavigateToJobMatch={() => setCurrentView('job-match')}
              onSelectAnalysis={handleSelectAnalysis}
              onOpenSample={handleOpenSample}
            />
          )}

          {currentView === 'history' && (
            <HistoryPage
              onSelectAnalysis={handleSelectAnalysis}
              onNavigateToUpload={handleStartUpload}
            />
          )}

          {currentView === 'profile' && <ProfilePage />}
        </main>

        <AuthModal />
      </div>
    </AuthProvider>
  );
}
