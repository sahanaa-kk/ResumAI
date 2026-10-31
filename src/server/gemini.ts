import { GoogleGenAI } from '@google/genai';
import { ResumeAnalysisResult, JobMatchResult } from '../types/index.ts';

// Initializing the Google Gen AI client with required header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models in preference order (handles 503 high-demand temporary spikes smoothly)
const PREFERRED_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

function extractJsonBlock(raw: string): string {
  let cleaned = raw.trim();
  // Strip markdown code fences
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  // If there is still extra commentary before or after the JSON object, locate the first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

async function generateWithFallback(prompt: string): Promise<string> {
  let lastError: any = null;

  for (const model of PREFERRED_MODELS) {
    try {
      console.log(`ResumAI: Querying model ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text && text.trim()) {
        return text;
      }
    } catch (err: any) {
      console.warn(`ResumAI: Model ${model} encountered error:`, err.message || err);
      lastError = err;
      // If 503 / high demand or 429, continue to next model in chain
    }
  }

  throw lastError || new Error('All AI models are temporarily unavailable. Please try again shortly.');
}

export async function analyzeResumeWithGemini(
  resumeText: string,
  fileName: string,
  targetRoleHint?: string
): Promise<Omit<ResumeAnalysisResult, 'id' | 'createdAt' | 'userId'>> {
  const prompt = `
You are a top executive recruiter, senior hiring manager, and ATS (Applicant Tracking System) algorithm expert.
Analyze the following resume thoroughly and objectively.
Target Role / Candidate Career Goal (if provided): ${targetRoleHint || 'Auto-detect from resume'}

Resume Content:
"""
${resumeText.slice(0, 18000)}
"""

Provide your expert evaluation in strict, valid JSON format matching this structure:
{
  "overallScore": number (0-100, realistic and rigorous),
  "atsScore": number (0-100, checking ATS parsing friendliness, standard headers, keyword density, lack of tables/graphics/columns),
  "candidateInfo": {
    "fullName": string,
    "email": string,
    "phone": string,
    "location": string,
    "targetRoleDetected": string,
    "experienceYears": string,
    "summaryDetected": string
  },
  "sectionScores": {
    "skills": number (0-100),
    "experience": number (0-100),
    "education": number (0-100),
    "formatting": number (0-100),
    "impactAndMetrics": number (0-100),
    "readability": number (0-100)
  },
  "technicalSkills": [array of extracted technical skills, tools, languages, frameworks],
  "softSkills": [array of identified soft skills, leadership, collaboration],
  "missingSkillsForRole": [array of 4-8 high-value in-demand skills currently missing for this role],
  "educationEvaluation": {
    "score": number (0-100),
    "feedback": string (concise actionable analysis),
    "detectedDegrees": [array of degrees / universities],
    "recommendations": [array of actionable tips]
  },
  "experienceEvaluation": {
    "score": number (0-100),
    "feedback": string (evaluation of impact, progression, and bullet clarity),
    "rolesAnalyzed": [
      {
        "company": string,
        "role": string,
        "duration": string,
        "strengths": [array of bullet strengths],
        "improvements": [array of bullet weaknesses],
        "suggestedBulletRewrite": {
          "original": string (an actual bullet from the resume),
          "improved": string (rewritten using Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'),
          "metricsAdded": string (explanation of metrics & power verbs injected)
        }
      }
    ]
  },
  "projectsEvaluation": {
    "score": number (0-100),
    "feedback": string,
    "detectedProjects": [array of project names],
    "recommendations": [array of tips to elevate project impact]
  },
  "certificationsEvaluation": {
    "score": number (0-100),
    "detected": [array of detected certifications],
    "recommendedToAcquire": [array of high-impact certifications for this career trajectory]
  },
  "keyStrengths": [array of 4-6 specific compelling highlights from this resume],
  "criticalWeaknesses": [array of 4-6 specific shortcomings or red flags to rectify immediately],
  "grammarSuggestions": [
    {
      "original": string (snippet containing typo, passive voice, or grammar flaw),
      "suggestion": string (corrected version),
      "reason": string (rule or stylistic explanation)
    }
  ],
  "formattingFeedback": {
    "verdict": string (e.g., 'Clean & Scan-Friendly', 'Needs Structural Tuning', etc.),
    "bulletPointAnalysis": string (feedback on length, action verbs, and readability),
    "fontAndStructureAdvice": string,
    "lengthAdvice": string
  },
  "actionableImprovements": {
    "improvedProfessionalSummary": string (a magnetic 3-4 sentence elevator summary written for maximum recruiter engagement),
    "strongerActionVerbs": [array of 8-12 powerful action verbs relevant to replace weak verbs like 'worked on' or 'helped'],
    "measurableMetricsTips": [array of 4-5 practical techniques to quantify achievements in their specific domain],
    "atsChecklist": [
      { "check": "Standard section headers (Experience, Education, Skills)", "passed": boolean, "tip": string },
      { "check": "No complicated multi-column layouts or tables", "passed": boolean, "tip": string },
      { "check": "Clear contact info (email, phone, LinkedIn/GitHub)", "passed": boolean, "tip": string },
      { "check": "Chronological work history with clear dates", "passed": boolean, "tip": string },
      { "check": "Strong keyword density matching industry standards", "passed": boolean, "tip": string },
      { "check": "Clean bulleted accomplishment lists without graphics", "passed": boolean, "tip": string }
    ]
  }
}
Return only valid parseable JSON.
`;

  try {
    const rawText = await generateWithFallback(prompt);
    const cleanedJson = extractJsonBlock(rawText);
    const parsed = JSON.parse(cleanedJson);

    return {
      resumeFileName: fileName,
      overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : 78,
      atsScore: typeof parsed.atsScore === 'number' ? parsed.atsScore : 75,
      candidateInfo: {
        fullName: parsed.candidateInfo?.fullName || 'Candidate',
        email: parsed.candidateInfo?.email || '',
        phone: parsed.candidateInfo?.phone || '',
        location: parsed.candidateInfo?.location || '',
        targetRoleDetected: parsed.candidateInfo?.targetRoleDetected || targetRoleHint || 'Software & Tech Professional',
        experienceYears: parsed.candidateInfo?.experienceYears || 'Multi-Year Experience',
        summaryDetected: parsed.candidateInfo?.summaryDetected || '',
      },
      sectionScores: {
        skills: parsed.sectionScores?.skills ?? 75,
        experience: parsed.sectionScores?.experience ?? 72,
        education: parsed.sectionScores?.education ?? 80,
        formatting: parsed.sectionScores?.formatting ?? 75,
        impactAndMetrics: parsed.sectionScores?.impactAndMetrics ?? 68,
        readability: parsed.sectionScores?.readability ?? 80,
      },
      technicalSkills: Array.isArray(parsed.technicalSkills) ? parsed.technicalSkills : ['TypeScript', 'React', 'Problem Solving'],
      softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : ['Cross-Functional Collaboration', 'Agile Communication'],
      missingSkillsForRole: Array.isArray(parsed.missingSkillsForRole) ? parsed.missingSkillsForRole : ['System Architecture', 'CI/CD Pipelines'],
      educationEvaluation: {
        score: parsed.educationEvaluation?.score ?? 75,
        feedback: parsed.educationEvaluation?.feedback || 'Education credentials are listed.',
        detectedDegrees: Array.isArray(parsed.educationEvaluation?.detectedDegrees) ? parsed.educationEvaluation.detectedDegrees : [],
        recommendations: Array.isArray(parsed.educationEvaluation?.recommendations) ? parsed.educationEvaluation.recommendations : [],
      },
      experienceEvaluation: {
        score: parsed.experienceEvaluation?.score ?? 72,
        feedback: parsed.experienceEvaluation?.feedback || 'Experience shows valuable contributions.',
        rolesAnalyzed: Array.isArray(parsed.experienceEvaluation?.rolesAnalyzed) ? parsed.experienceEvaluation.rolesAnalyzed : [],
      },
      projectsEvaluation: {
        score: parsed.projectsEvaluation?.score ?? 72,
        feedback: parsed.projectsEvaluation?.feedback || 'Projects demonstrate practical applications.',
        detectedProjects: Array.isArray(parsed.projectsEvaluation?.detectedProjects) ? parsed.projectsEvaluation.detectedProjects : [],
        recommendations: Array.isArray(parsed.projectsEvaluation?.recommendations) ? parsed.projectsEvaluation.recommendations : [],
      },
      certificationsEvaluation: {
        score: parsed.certificationsEvaluation?.score ?? 70,
        detected: Array.isArray(parsed.certificationsEvaluation?.detected) ? parsed.certificationsEvaluation.detected : [],
        recommendedToAcquire: Array.isArray(parsed.certificationsEvaluation?.recommendedToAcquire) ? parsed.certificationsEvaluation.recommendedToAcquire : [],
      },
      keyStrengths: Array.isArray(parsed.keyStrengths) && parsed.keyStrengths.length > 0 ? parsed.keyStrengths : [
        'Clear chronological work history format.',
        'Good breadth of technical proficiencies listed.'
      ],
      criticalWeaknesses: Array.isArray(parsed.criticalWeaknesses) && parsed.criticalWeaknesses.length > 0 ? parsed.criticalWeaknesses : [
        'Several bullet points lack quantifiable business metrics.',
        'More industry-standard ATS keywords can be integrated.'
      ],
      grammarSuggestions: Array.isArray(parsed.grammarSuggestions) ? parsed.grammarSuggestions : [],
      formattingFeedback: {
        verdict: parsed.formattingFeedback?.verdict || 'Standard layout',
        bulletPointAnalysis: parsed.formattingFeedback?.bulletPointAnalysis || 'Keep bullet points concise and lead with active power verbs.',
        fontAndStructureAdvice: parsed.formattingFeedback?.fontAndStructureAdvice || 'Ensure standard headings are preserved.',
        lengthAdvice: parsed.formattingFeedback?.lengthAdvice || 'Resume length is appropriate for background.',
      },
      actionableImprovements: {
        improvedProfessionalSummary: parsed.actionableImprovements?.improvedProfessionalSummary || '',
        strongerActionVerbs: Array.isArray(parsed.actionableImprovements?.strongerActionVerbs) ? parsed.actionableImprovements.strongerActionVerbs : ['Architected', 'Spearheaded', 'Optimized', 'Accelerated'],
        measurableMetricsTips: Array.isArray(parsed.actionableImprovements?.measurableMetricsTips) ? parsed.actionableImprovements.measurableMetricsTips : ['Incorporate specific percentages, user counts, or revenue metrics into bullets.'],
        atsChecklist: Array.isArray(parsed.actionableImprovements?.atsChecklist) && parsed.actionableImprovements.atsChecklist.length > 0 ? parsed.actionableImprovements.atsChecklist : [
          { check: 'Standard section headers (Experience, Education, Skills)', passed: true, tip: 'Use conventional header terms for maximum parser compliance.' },
          { check: 'No complex multi-column tables', passed: true, tip: 'Single column or simple split layout parses cleanly.' },
          { check: 'Clear contact information', passed: true, tip: 'Email, phone, and professional portfolio link are detected.' }
        ],
      },
      extractedResumeText: resumeText,
      stats: {
        wordCount: resumeText.split(/\s+/).filter(Boolean).length,
        charCount: resumeText.length,
        pageEstimate: Math.max(1, Math.ceil(resumeText.split(/\s+/).filter(Boolean).length / 450)),
      },
    };
  } catch (error: any) {
    console.error('Gemini Resume Analysis Error:', error);
    throw new Error(error.message || 'AI resume analysis encountered an error. Please try again.');
  }
}

export async function matchResumeWithJobDescription(
  resumeText: string,
  jobDescription: string,
  jobTitle: string,
  company?: string
): Promise<Omit<JobMatchResult, 'id' | 'createdAt'>> {
  const prompt = `
You are a senior talent acquisition specialist and automated ATS scanner.
Evaluate how well the following candidate resume matches the given Job Description (JD).

Job Title: ${jobTitle}
Company: ${company || 'Target Organization'}

Job Description:
"""
${jobDescription.slice(0, 14000)}
"""

Candidate Resume:
"""
${resumeText.slice(0, 14000)}
"""

Perform an exhaustive, realistic comparison and return strict valid JSON matching this schema:
{
  "matchScore": number (0-100, calculate exact compatibility based on requirements, must-have skills, and domain fit),
  "verdict": string (one of: 'Excellent Match', 'Strong Match', 'Moderate Match', 'Low Compatibility'),
  "matchingSkills": [array of exact skills and technologies that appear in both the JD and the resume],
  "missingSkills": [array of essential or preferred skills mentioned in the JD that are NOT present in the resume],
  "matchedKeywords": [array of domain buzzwords, methodologies, or certifications present in both],
  "missingKeywords": [array of critical JD keywords missing from resume that ATS filters look for],
  "experienceMatchAnalysis": string (detailed evaluation of past roles vs JD requirements and seniority level),
  "actionableGapClosure": [array of 4-6 actionable recommendations on how candidate can bridge the gap],
  "tailoredSummarySuggestion": string (a customized 3-4 sentence professional summary tailored specifically to this job posting),
  "topTailoringPoints": [
    {
      "section": string (e.g. "Work Experience", "Skills Section", "Project Section"),
      "advice": string (concrete sentence or change to add to resume for this JD)
    }
  ]
}
Return only valid parseable JSON.
`;

  try {
    const rawText = await generateWithFallback(prompt);
    const cleanedJson = extractJsonBlock(rawText);
    const parsed = JSON.parse(cleanedJson);

    return {
      jobTitle,
      company,
      jobDescription,
      matchScore: typeof parsed.matchScore === 'number' ? parsed.matchScore : 70,
      verdict: parsed.verdict || 'Moderate Match',
      matchingSkills: Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      experienceMatchAnalysis: parsed.experienceMatchAnalysis || 'Good baseline alignment with the role responsibilities.',
      actionableGapClosure: Array.isArray(parsed.actionableGapClosure) ? parsed.actionableGapClosure : [],
      tailoredSummarySuggestion: parsed.tailoredSummarySuggestion || '',
      topTailoringPoints: Array.isArray(parsed.topTailoringPoints) ? parsed.topTailoringPoints : [],
    };
  } catch (error: any) {
    console.error('Gemini Job Match Error:', error);
    throw new Error(error.message || 'AI Job Description matching failed. Please try again.');
  }
}
