import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, ResumeAnalysisResult, JobMatchResult } from '../types/index.ts';

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

interface StoredSession {
  token: string;
  userId: string;
  expiresAt: number;
}

interface DatabaseSchema {
  users: StoredUser[];
  sessions: StoredSession[];
  analyses: ResumeAnalysisResult[];
  jobMatches: JobMatchResult[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'db.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

class Database {
  private data: DatabaseSchema = {
    users: [],
    sessions: [],
    analyses: [],
    jobMatches: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        // Seed default demo user
        const demoSalt = crypto.randomBytes(16).toString('hex');
        const demoHash = hashPassword('demo123', demoSalt);
        const demoUser: StoredUser = {
          id: 'user_demo_1',
          name: 'Sarah Jenkins',
          email: 'demo@resumai.io',
          passwordHash: demoHash,
          salt: demoSalt,
          targetRole: 'Senior Full Stack Engineer',
          experienceLevel: 'Mid-Level (3-5 yrs)',
          industry: 'Software & Technology',
          createdAt: new Date().toISOString(),
        };

        this.data.users = [demoUser];
        this.save();
      }
    } catch (err) {
      console.error('Error initializing DB:', err);
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to file:', err);
    }
  }

  // --- Auth Methods ---
  public createUser(params: {
    name: string;
    email: string;
    password: string;
    targetRole?: string;
    experienceLevel?: User['experienceLevel'];
    industry?: string;
  }): User {
    const existing = this.data.users.find(
      (u) => u.email.toLowerCase() === params.email.toLowerCase()
    );
    if (existing) {
      throw new Error('A user with this email already exists.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(params.password, salt);
    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      passwordHash,
      salt,
      targetRole: params.targetRole,
      experienceLevel: params.experienceLevel,
      industry: params.industry,
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.save();

    const { passwordHash: _, salt: __, ...userObj } = newUser;
    return userObj;
  }

  public verifyLogin(email: string, password: string): { user: User; token: string } {
    const user = this.data.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const computed = hashPassword(password, user.salt);
    if (computed !== user.passwordHash) {
      throw new Error('Invalid email or password.');
    }

    const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    this.data.sessions.push({
      token,
      userId: user.id,
      expiresAt,
    });
    this.save();

    const { passwordHash: _, salt: __, ...userObj } = user;
    return { user: userObj, token };
  }

  public getUserByToken(token: string): User | null {
    if (!token) return null;
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = this.data.users.find((u) => u.id === session.userId);
    if (!user) return null;

    const { passwordHash: _, salt: __, ...userObj } = user;
    return userObj;
  }

  public removeSession(token: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  public updateUserProfile(
    userId: string,
    updates: Partial<Pick<User, 'name' | 'targetRole' | 'experienceLevel' | 'industry'>>
  ): User {
    const idx = this.data.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found.');

    const user = this.data.users[idx];
    if (updates.name) user.name = updates.name.trim();
    if (updates.targetRole !== undefined) user.targetRole = updates.targetRole;
    if (updates.experienceLevel !== undefined) user.experienceLevel = updates.experienceLevel;
    if (updates.industry !== undefined) user.industry = updates.industry;

    this.save();
    const { passwordHash: _, salt: __, ...userObj } = user;
    return userObj;
  }

  // --- Analyses ---
  public saveAnalysis(
    analysisData: Omit<ResumeAnalysisResult, 'id' | 'createdAt'>,
    userId?: string
  ): ResumeAnalysisResult {
    const id = `ana_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const analysis: ResumeAnalysisResult = {
      ...analysisData,
      id,
      userId,
      createdAt: new Date().toISOString(),
    };

    this.data.analyses.unshift(analysis);
    this.save();
    return analysis;
  }

  public getAnalyses(userId?: string): ResumeAnalysisResult[] {
    if (userId) {
      return this.data.analyses.filter((a) => a.userId === userId || !a.userId);
    }
    return this.data.analyses;
  }

  public getAnalysisById(id: string): ResumeAnalysisResult | null {
    return this.data.analyses.find((a) => a.id === id) || null;
  }

  public deleteAnalysis(id: string): boolean {
    const prevLen = this.data.analyses.length;
    this.data.analyses = this.data.analyses.filter((a) => a.id !== id);
    if (this.data.analyses.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Job Matches ---
  public saveJobMatch(
    matchData: Omit<JobMatchResult, 'id' | 'createdAt'>,
    userId?: string
  ): JobMatchResult {
    const id = `match_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const match: JobMatchResult = {
      ...matchData,
      id,
      createdAt: new Date().toISOString(),
    };

    this.data.jobMatches.unshift(match);
    this.save();
    return match;
  }

  public getJobMatches(userId?: string): JobMatchResult[] {
    return this.data.jobMatches;
  }
}

export const db = new Database();
