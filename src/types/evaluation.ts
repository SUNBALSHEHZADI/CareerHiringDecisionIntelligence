export interface SkillGap {
  skill: string;
  importance: "high" | "medium" | "low";
  action: string;
}

export interface InterviewQuestion {
  id: string;
  type: "technical" | "behavioral" | "resume" | "weak-area";
  question: string;
  context?: string;
}

export interface EvaluationResult {
  id: string;
  decision: "APPLY" | "DO_NOT_APPLY";
  readinessScore: number;
  reasoning: string[];
  skillGaps: SkillGap[];
  interviewQuestions: InterviewQuestion[];
  cvSummary: string;
  jobSummary: string;
  createdAt: Date;
}

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

export interface AnalyticsData {
  totalEvaluations: number;
  applyCount: number;
  doNotApplyCount: number;
  averageReadinessScore: number;
  commonSkillGaps: { skill: string; count: number }[];
  interviewAttempts: number;
  trustScore: number;
}
