/**
 * Core types for ResumAI Resume & ATS Analyzer
 */

export interface User {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  experienceLevel?: 'Student/Fresher' | 'Junior (1-3 yrs)' | 'Mid-Level (3-5 yrs)' | 'Senior (5+ yrs)' | 'Lead / Executive';
  industry?: string;
  createdAt: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface GrammarItem {
  original: string;
  suggestion: string;
  reason: string;
}

export interface ExperienceItemAnalysis {
  company: string;
  role: string;
  duration?: string;
  strengths: string[];
  improvements: string[];
  suggestedBulletRewrite?: {
    original: string;
    improved: string;
    metricsAdded: string;
  };
}

export interface ResumeAnalysisResult {
  id: string;
  userId?: string;
  resumeFileName: string;
  createdAt: string;
  overallScore: number;
  atsScore: number;
  
  // High-level candidate extraction
  candidateInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    targetRoleDetected: string;
    experienceYears: string;
    summaryDetected: string;
  };

  // Section breakdown scores (0-100)
  sectionScores: {
    skills: number;
    experience: number;
    education: number;
    formatting: number;
    impactAndMetrics: number;
    readability: number;
  };

  // Skills
  technicalSkills: string[];
  softSkills: string[];
  missingSkillsForRole: string[];

  // Evaluations
  educationEvaluation: {
    score: number;
    feedback: string;
    detectedDegrees: string[];
    recommendations: string[];
  };

  experienceEvaluation: {
    score: number;
    feedback: string;
    rolesAnalyzed: ExperienceItemAnalysis[];
  };

  projectsEvaluation: {
    score: number;
    feedback: string;
    detectedProjects: string[];
    recommendations: string[];
  };

  certificationsEvaluation: {
    score: number;
    detected: string[];
    recommendedToAcquire: string[];
  };

  // Strengths & Weaknesses
  keyStrengths: string[];
  criticalWeaknesses: string[];

  // Grammar & Readability
  grammarSuggestions: GrammarItem[];
  formattingFeedback: {
    verdict: string;
    bulletPointAnalysis: string;
    fontAndStructureAdvice: string;
    lengthAdvice: string;
  };

  // Actionable Suggestions
  actionableImprovements: {
    improvedProfessionalSummary: string;
    strongerActionVerbs: string[];
    measurableMetricsTips: string[];
    atsChecklist: {
      check: string;
      passed: boolean;
      tip: string;
    }[];
  };

  // Original extracted resume text
  extractedResumeText: string;
  stats: {
    wordCount: number;
    charCount: number;
    pageEstimate: number;
  };
}

export interface JobMatchResult {
  id: string;
  analysisId?: string;
  jobTitle: string;
  company?: string;
  jobDescription: string;
  createdAt: string;
  matchScore: number; // 0 - 100
  verdict: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Low Compatibility';
  matchingSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  experienceMatchAnalysis: string;
  actionableGapClosure: string[];
  tailoredSummarySuggestion: string;
  topTailoringPoints: {
    section: string;
    advice: string;
  }[];
}
