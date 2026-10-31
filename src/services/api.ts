import {
  User,
  ResumeAnalysisResult,
  JobMatchResult,
} from '../types/index.ts';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('resumai_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async register(data: {
    name: string;
    email: string;
    password: string;
    targetRole?: string;
    experienceLevel?: User['experienceLevel'];
    industry?: string;
  }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      throw new Error('Not logged in');
    }
    return res.json();
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeader(),
      });
    } catch {
      // ignore
    }
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update failed');
    }
    return res.json();
  },

  // Samples
  async getSampleResumes() {
    const res = await fetch('/api/samples/resumes');
    return res.json();
  },

  async getSampleJobs() {
    const res = await fetch('/api/samples/jobs');
    return res.json();
  },

  // Resume Upload
  async uploadFile(file: File): Promise<{
    fileName: string;
    extractedText: string;
    stats: { wordCount: number; charCount: number; pageEstimate: number };
  }> {
    const formData = new FormData();
    formData.append('resumeFile', file);

    const res = await fetch('/api/resume/upload', {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  // Analyze Resume
  async analyzeResume(data: {
    resumeText: string;
    fileName?: string;
    targetRole?: string;
  }): Promise<ResumeAnalysisResult> {
    const res = await fetch('/api/resume/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Analysis failed');
    }
    return res.json();
  },

  // Match Job
  async matchJob(data: {
    resumeText: string;
    jobDescription: string;
    jobTitle: string;
    company?: string;
    analysisId?: string;
  }): Promise<JobMatchResult> {
    const res = await fetch('/api/resume/match-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Job matching failed');
    }
    return res.json();
  },

  // Analyses History
  async getAnalyses(): Promise<ResumeAnalysisResult[]> {
    const res = await fetch('/api/analyses', {
      headers: getAuthHeader(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAnalysis(id: string): Promise<ResumeAnalysisResult> {
    const res = await fetch(`/api/analyses/${id}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Analysis not found');
    return res.json();
  },

  async deleteAnalysis(id: string): Promise<boolean> {
    const res = await fetch(`/api/analyses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.ok;
  },
};
