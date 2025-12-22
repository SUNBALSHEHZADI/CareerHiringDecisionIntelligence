import type { 
  EvaluationResult, 
  StudentAnalyticsData, 
  HRAnalyticsData,
  InterviewAttempt,
  JobRole,
  Candidate
} from "@/types/evaluation";

const STORAGE_KEYS = {
  EVALUATIONS: "career-decide-evaluations",
  INTERVIEWS: "career-decide-interviews",
  FEEDBACK: "career-decide-feedback",
  JOB_ROLES: "career-decide-job-roles",
  CANDIDATES: "career-decide-candidates",
  USER_MODE: "career-decide-user-mode",
};

// Mode management
export function saveUserMode(mode: "student" | "hr"): void {
  localStorage.setItem(STORAGE_KEYS.USER_MODE, mode);
}

export function getUserMode(): "student" | "hr" {
  return (localStorage.getItem(STORAGE_KEYS.USER_MODE) as "student" | "hr") || "student";
}

// Evaluations
export function saveEvaluation(evaluation: EvaluationResult): void {
  const existing = getEvaluations();
  existing.push(evaluation);
  localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(existing));
}

export function getEvaluations(): EvaluationResult[] {
  const data = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
  if (!data) return [];
  try {
    return JSON.parse(data).map((e: EvaluationResult) => ({
      ...e,
      createdAt: new Date(e.createdAt),
    }));
  } catch {
    return [];
  }
}

export function getEvaluationById(id: string): EvaluationResult | undefined {
  return getEvaluations().find(e => e.id === id);
}

// Interview attempts
export function saveInterviewAttempt(evaluationId: string, attempt: InterviewAttempt): void {
  const existing = getInterviewAttempts();
  existing.push({ evaluationId, ...attempt });
  localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(existing));
}

export function getInterviewAttempts(): (InterviewAttempt & { evaluationId: string })[] {
  const data = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Feedback
export function saveFeedback(evaluationId: string, trusted: boolean): void {
  const existing = getFeedback();
  existing.push({ evaluationId, trusted, timestamp: new Date() });
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(existing));
}

export function getFeedback(): { evaluationId: string; trusted: boolean; timestamp: Date }[] {
  const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Job roles (HR mode)
export function saveJobRole(role: JobRole): void {
  const existing = getJobRoles();
  existing.push(role);
  localStorage.setItem(STORAGE_KEYS.JOB_ROLES, JSON.stringify(existing));
}

export function getJobRoles(): JobRole[] {
  const data = localStorage.getItem(STORAGE_KEYS.JOB_ROLES);
  if (!data) return [];
  try {
    return JSON.parse(data).map((r: JobRole) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }));
  } catch {
    return [];
  }
}

export function getJobRoleById(id: string): JobRole | undefined {
  return getJobRoles().find(r => r.id === id);
}

// Candidates (HR mode)
export function saveCandidates(jobRoleId: string, candidates: Candidate[]): void {
  const existing = getAllCandidates();
  const updated = { ...existing, [jobRoleId]: candidates };
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(updated));
}

export function getCandidatesForJob(jobRoleId: string): Candidate[] {
  const all = getAllCandidates();
  return all[jobRoleId] || [];
}

function getAllCandidates(): Record<string, Candidate[]> {
  const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Student Analytics
export function getStudentAnalytics(): StudentAnalyticsData {
  const evaluations = getEvaluations().filter(e => e.mode === "student");
  const interviews = getInterviewAttempts();
  const feedback = getFeedback();

  const applyCount = evaluations.filter((e) => e.decision === "APPLY").length;
  const borderlineCount = evaluations.filter((e) => e.decision === "BORDERLINE").length;
  const doNotApplyCount = evaluations.filter((e) => e.decision === "DO_NOT_APPLY").length;

  const totalScore = evaluations.reduce((sum, e) => sum + e.readinessScore, 0);
  const averageReadinessScore = evaluations.length > 0 ? Math.round(totalScore / evaluations.length) : 0;

  // Count skill gaps
  const skillGapCounts: Record<string, number> = {};
  evaluations.forEach((e) => {
    e.skillGaps.forEach((gap) => {
      skillGapCounts[gap.skill] = (skillGapCounts[gap.skill] || 0) + 1;
    });
  });

  const commonSkillGaps = Object.entries(skillGapCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const trustedCount = feedback.filter((f) => f.trusted).length;
  const trustScore = feedback.length > 0 ? Math.round((trustedCount / feedback.length) * 100) : 0;

  return {
    totalEvaluations: evaluations.length,
    applyCount,
    borderlineCount,
    doNotApplyCount,
    averageReadinessScore,
    commonSkillGaps,
    interviewAttempts: interviews.length,
    trustScore,
  };
}

// HR Analytics
export function getHRAnalytics(): HRAnalyticsData {
  const evaluations = getEvaluations().filter(e => e.mode === "hr");
  
  const interviewRecommended = evaluations.filter(e => e.decision === "APPLY").length;
  const interviewRecommendedPercent = evaluations.length > 0 
    ? Math.round((interviewRecommended / evaluations.length) * 100)
    : 0;
  
  const totalScore = evaluations.reduce((sum, e) => sum + e.readinessScore, 0);
  const averageReadinessScore = evaluations.length > 0 ? Math.round(totalScore / evaluations.length) : 0;
  
  // Common missing skills
  const missingSkillCounts: Record<string, number> = {};
  evaluations.forEach(e => {
    e.skillDiff.missing.forEach(m => {
      missingSkillCounts[m.skill] = (missingSkillCounts[m.skill] || 0) + 1;
    });
  });
  
  const commonMissingSkills = Object.entries(missingSkillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Assume 5 minutes saved per candidate vs manual screening
  const timeSavedMinutes = evaluations.length * 5;
  
  return {
    totalCandidates: evaluations.length,
    interviewRecommended,
    interviewRecommendedPercent,
    commonMissingSkills,
    averageReadinessScore,
    timeSavedMinutes,
  };
}
