import express, { Request, Response } from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/db.ts';
import { parsePdfBuffer, parseDocxBuffer, extractStats } from './src/server/parser.ts';
import { analyzeResumeWithGemini, matchResumeWithJobDescription } from './src/server/gemini.ts';
import { SAMPLE_RESUMES, SAMPLE_JOBS } from './src/server/samples.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Multer in-memory storage for handling PDF / DOCX file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|doc|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are supported.'));
    }
  },
});

// Auth helper middleware
function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return db.getUserByToken(token);
}

// ==========================================
// API ROUTES
// ==========================================

// --- Auth Routes ---
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, targetRole, experienceLevel, industry } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const user = db.createUser({
      name,
      email,
      password,
      targetRole,
      experienceLevel,
      industry,
    });
    const loginData = db.verifyLogin(email, password);
    res.status(201).json(loginData);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const loginData = db.verifyLogin(email, password);
    res.json(loginData);
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Login failed.' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  res.json({ user });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    db.removeSession(token);
  }
  res.json({ success: true });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }

  try {
    const updated = db.updateUserProfile(user.id, req.body);
    res.json({ user: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Sample Resumes & Jobs ---
app.get('/api/samples/resumes', (_req: Request, res: Response) => {
  res.json(SAMPLE_RESUMES);
});

app.get('/api/samples/jobs', (_req: Request, res: Response) => {
  res.json(SAMPLE_JOBS);
});

// --- Resume Upload & Parsing ---
app.post('/api/resume/upload', upload.single('resumeFile'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file was uploaded.' });
      return;
    }

    const { originalname, buffer, mimetype } = req.file;
    let extractedText = '';

    if (mimetype === 'application/pdf' || originalname.toLowerCase().endsWith('.pdf')) {
      extractedText = await parsePdfBuffer(buffer);
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.toLowerCase().endsWith('.docx')
    ) {
      extractedText = await parseDocxBuffer(buffer);
    } else if (originalname.toLowerCase().endsWith('.txt') || mimetype === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else {
      // Fallback
      extractedText = buffer.toString('utf-8');
    }

    extractedText = extractedText.trim();
    if (!extractedText || extractedText.length < 50) {
      res.status(400).json({
        error: 'Unable to extract legible text from this file. Please make sure the document is not an image-only scan or empty.',
      });
      return;
    }

    const stats = extractStats(extractedText);
    res.json({
      fileName: originalname,
      extractedText,
      stats,
    });
  } catch (err: any) {
    console.error('File parsing error:', err);
    res.status(500).json({ error: err.message || 'Failed to parse resume file.' });
  }
});

// --- AI Resume Analysis ---
app.post('/api/resume/analyze', async (req: Request, res: Response) => {
  try {
    const { resumeText, fileName, targetRole } = req.body;
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
      res.status(400).json({ error: 'Please provide valid resume text of at least 50 characters.' });
      return;
    }

    const user = getAuthenticatedUser(req);
    const resolvedRole = targetRole || user?.targetRole;

    const analysis = await analyzeResumeWithGemini(
      resumeText,
      fileName || 'Uploaded Resume',
      resolvedRole
    );

    const saved = db.saveAnalysis(analysis, user?.id);
    res.json(saved);
  } catch (err: any) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: err.message || 'AI resume analysis encountered an error.' });
  }
});

// --- Job Description Matching ---
app.post('/api/resume/match-job', async (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription, jobTitle, company, analysisId } = req.body;

    if (!resumeText || !jobDescription || !jobTitle) {
      res.status(400).json({
        error: 'Resume text, job description, and job title are all required.',
      });
      return;
    }

    const user = getAuthenticatedUser(req);
    const matchResult = await matchResumeWithJobDescription(
      resumeText,
      jobDescription,
      jobTitle,
      company
    );

    const saved = db.saveJobMatch(
      {
        ...matchResult,
        analysisId,
      },
      user?.id
    );

    res.json(saved);
  } catch (err: any) {
    console.error('Job match error:', err);
    res.status(500).json({ error: err.message || 'Job description matching failed.' });
  }
});

// --- Analysis History ---
app.get('/api/analyses', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const items = db.getAnalyses(user?.id);
  res.json(items);
});

app.get('/api/analyses/:id', (req: Request, res: Response) => {
  const item = db.getAnalysisById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Analysis not found.' });
    return;
  }
  res.json(item);
});

app.delete('/api/analyses/:id', (req: Request, res: Response) => {
  const success = db.deleteAnalysis(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Analysis not found.' });
    return;
  }
  res.json({ success: true });
});

// --- Vite Middleware Integration for Development & Static Serving for Production ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Mount Vite middlewares in development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
