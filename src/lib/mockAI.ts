import type { EvaluationResult, InterviewQuestion, SkillGap, InterviewAttempt } from "@/types/evaluation";

// Mock AI responses for demonstration - will be replaced with real AI backend
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function extractKeywords(text: string): string[] {
  const techKeywords = [
    "react", "typescript", "javascript", "python", "java", "node", "sql", "aws",
    "docker", "kubernetes", "git", "agile", "rest", "api", "testing", "ci/cd",
    "mongodb", "postgresql", "redis", "graphql", "vue", "angular", "next.js",
    "machine learning", "data structures", "algorithms", "system design"
  ];
  const lowerText = text.toLowerCase();
  return techKeywords.filter(keyword => lowerText.includes(keyword));
}

export function evaluateReadiness(cvText: string, jobDescription: string): EvaluationResult {
  const cvKeywords = extractKeywords(cvText);
  const jdKeywords = extractKeywords(jobDescription);
  
  const matchedSkills = cvKeywords.filter(skill => jdKeywords.includes(skill));
  const missingSkills = jdKeywords.filter(skill => !cvKeywords.includes(skill));
  
  // Calculate score based on skill match
  const matchRatio = jdKeywords.length > 0 ? matchedSkills.length / jdKeywords.length : 0.5;
  const baseScore = Math.round(matchRatio * 100);
  const readinessScore = Math.min(95, Math.max(25, baseScore + Math.floor(Math.random() * 15)));
  
  const decision: "APPLY" | "DO_NOT_APPLY" = readinessScore >= 70 ? "APPLY" : "DO_NOT_APPLY";
  
  const skillGaps: SkillGap[] = missingSkills.slice(0, 5).map((skill, index) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    importance: index < 2 ? "high" : index < 4 ? "medium" : "low",
    action: getActionForSkill(skill),
  }));
  
  const reasoning = generateReasoning(decision, readinessScore, matchedSkills, missingSkills);
  
  const interviewQuestions: InterviewQuestion[] = decision === "APPLY" 
    ? generateInterviewQuestions(cvText, jobDescription, matchedSkills, missingSkills)
    : [];
  
  return {
    id: generateId(),
    decision,
    readinessScore,
    reasoning,
    skillGaps,
    interviewQuestions,
    cvSummary: `Profile with ${cvKeywords.length} technical skills identified`,
    jobSummary: `Role requiring ${jdKeywords.length} key technical competencies`,
    createdAt: new Date(),
  };
}

function getActionForSkill(skill: string): string {
  const actions: Record<string, string> = {
    react: "Complete a React project on GitHub showcasing hooks and state management",
    typescript: "Convert an existing JavaScript project to TypeScript",
    python: "Build a Python automation script or data analysis project",
    aws: "Get AWS Cloud Practitioner certification and deploy a project",
    docker: "Containerize an existing application and document the process",
    kubernetes: "Set up a local K8s cluster with minikube and deploy an app",
    "machine learning": "Complete a Coursera ML course and build a simple model",
    "system design": "Study system design patterns and document a design for a scalable app",
  };
  return actions[skill] || `Complete an online course or hands-on project involving ${skill}`;
}

function generateReasoning(
  decision: "APPLY" | "DO_NOT_APPLY",
  score: number,
  matched: string[],
  missing: string[]
): string[] {
  if (decision === "APPLY") {
    return [
      `Strong alignment with ${matched.length} core technical requirements`,
      score >= 85 
        ? "Your profile demonstrates excellent readiness for this role"
        : "Your skills match the fundamental requirements with room for growth",
      matched.length > 0 
        ? `Key strengths: ${matched.slice(0, 3).join(", ")}`
        : "Your general technical foundation is solid",
      "Interview preparation recommended to address potential weak areas",
    ];
  }
  
  return [
    `Missing ${missing.length} critical skills required for this position`,
    "Current profile does not meet the minimum threshold for success",
    missing.length > 0 
      ? `Priority gaps: ${missing.slice(0, 3).join(", ")}`
      : "General technical depth needs improvement",
    "Recommended: Focus on skill development before applying",
  ];
}

function generateInterviewQuestions(
  cvText: string,
  jobDescription: string,
  matched: string[],
  missing: string[]
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [
    {
      id: generateId(),
      type: "technical",
      question: matched[0] 
        ? `Explain a challenging problem you solved using ${matched[0]} and walk me through your approach.`
        : "Describe your approach to debugging a complex technical issue.",
      context: "Tests problem-solving and technical depth",
    },
    {
      id: generateId(),
      type: "behavioral",
      question: "Tell me about a time you had to learn a new technology quickly to meet a deadline.",
      context: "Assesses adaptability and learning ability",
    },
    {
      id: generateId(),
      type: "resume",
      question: "Walk me through your most impactful project and what you learned from it.",
      context: "Evaluates project experience and reflection",
    },
    {
      id: generateId(),
      type: "technical",
      question: "How would you design a scalable API for a feature with millions of users?",
      context: "Tests system design thinking",
    },
    {
      id: generateId(),
      type: "behavioral",
      question: "Describe a situation where you disagreed with a team decision. How did you handle it?",
      context: "Assesses collaboration and communication",
    },
  ];
  
  if (missing.length > 0) {
    questions.push({
      id: generateId(),
      type: "weak-area",
      question: `This role requires ${missing[0]}. How would you approach learning it quickly?`,
      context: "Probes awareness of gaps and learning strategy",
    });
  }
  
  return questions;
}

export function evaluateAnswer(question: string, answer: string): InterviewAttempt["feedback"] {
  const wordCount = answer.split(/\s+/).length;
  const hasStructure = answer.includes("because") || answer.includes("therefore") || answer.includes("first");
  const hasExample = answer.includes("example") || answer.includes("project") || answer.includes("when I");
  
  const clarity = Math.min(100, Math.max(30, 40 + wordCount * 0.5 + (hasStructure ? 20 : 0)));
  const technicalDepth = Math.min(100, Math.max(25, 35 + wordCount * 0.3 + Math.random() * 20));
  const relevance = Math.min(100, Math.max(40, 50 + (hasExample ? 25 : 0) + Math.random() * 15));
  
  const overallScore = Math.round((clarity + technicalDepth + relevance) / 3);
  
  const suggestions: string[] = [];
  if (wordCount < 50) suggestions.push("Provide more detail and specific examples");
  if (!hasStructure) suggestions.push("Structure your answer with clear beginning, middle, and end");
  if (!hasExample) suggestions.push("Include a concrete example from your experience");
  if (overallScore < 70) suggestions.push("Practice STAR method (Situation, Task, Action, Result)");
  
  return {
    clarity: Math.round(clarity),
    technicalDepth: Math.round(technicalDepth),
    relevance: Math.round(relevance),
    overallScore,
    suggestions,
  };
}
