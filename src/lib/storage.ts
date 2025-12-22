import type { EvaluationResult, AnalyticsData, InterviewAttempt } from "@/types/evaluation";

const STORAGE_KEYS = {
  EVALUATIONS: "career-decide-evaluations",
  INTERVIEWS: "career-decide-interviews",
  FEEDBACK: "career-decide-feedback",
};

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

export function getAnalytics(): AnalyticsData {
  const evaluations = getEvaluations();
  const interviews = getInterviewAttempts();
  const feedback = getFeedback();

  const applyCount = evaluations.filter((e) => e.decision === "APPLY").length;
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
    doNotApplyCount,
    averageReadinessScore,
    commonSkillGaps,
    interviewAttempts: interviews.length,
    trustScore,
  };
}
