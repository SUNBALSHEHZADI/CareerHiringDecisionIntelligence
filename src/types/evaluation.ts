// User modes
export type UserMode = "student" | "hr";

// Skill with evidence from resume
export interface ExtractedSkill {
  skill: string;
  evidence: string;
  source: "skills" | "projects" | "experience" | "certifications";
}

// Job skill requirement
export interface JobSkill {
  skill: string;
  required: boolean; // true = required, false = preferred
}

// Skill difference output
export interface SkillDiff {
  matched: ExtractedSkill[];
  missing: JobSkill[];
  extra: ExtractedSkill[];
}

// Skill gap with learning path
export interface SkillGap {
  skill: string;
  importance: "high" | "medium" | "low";
  whyMissing: string;
  whatToLearn: string;
  howToPractice: string;
  resumeAddition: string;
}

// Interview question
export interface InterviewQuestion {
  id: string;
  type: "technical" | "behavioral" | "resume" | "weak-area";
  question: string;
  context?: string;
  relatedSkill?: string;
}

// Decision type with borderline
export type Decision = "APPLY" | "BORDERLINE" | "DO_NOT_APPLY";

// Candidate evaluation result
export interface EvaluationResult {
  id: string;
  mode: UserMode;
  candidateName?: string;
  decision: Decision;
  readinessScore: number;
  extractedResumeSkills: ExtractedSkill[];
  jobRequiredSkills: JobSkill[];
  skillDiff: SkillDiff;
  reasoning: string[];
  skillGaps: SkillGap[];
  interviewQuestions: InterviewQuestion[];
  cvSummary: string;
  jobSummary: string;
  createdAt: Date;
}

// Interview attempt feedback
export interface InterviewAttempt {
  questionId: string;
  question: string;
  answer: string;
  feedback: {
    clarity: number;
    technicalDepth: number;
    relevance: number;
    overallScore: number;
    suggestions: string[];
  };
}

// Job role for HR mode
export interface JobRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  createdAt: Date;
}

// Candidate in HR mode
export interface Candidate {
  id: string;
  name: string;
  resumeText: string;
  evaluation?: EvaluationResult;
}

// HR Analytics
export interface HRAnalyticsData {
  totalCandidates: number;
  interviewRecommended: number;
  interviewRecommendedPercent: number;
  commonMissingSkills: { skill: string; count: number }[];
  averageReadinessScore: number;
  timeSavedMinutes: number;
}

// Student Analytics
export interface StudentAnalyticsData {
  totalEvaluations: number;
  applyCount: number;
  borderlineCount: number;
  doNotApplyCount: number;
  averageReadinessScore: number;
  commonSkillGaps: { skill: string; count: number }[];
  interviewAttempts: number;
  trustScore: number;
}

// Chatbot message
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  language: "en" | "ur";
  timestamp: Date;
}

// ATS Integration schema
export interface ATSExportData {
  candidate_id: string;
  job_id: string;
  readiness_score: number;
  decision: Decision;
  matched_skills: string[];
  missing_skills: string[];
  interview_recommendation: boolean;
}
