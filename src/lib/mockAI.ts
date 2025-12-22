import type { 
  EvaluationResult, 
  InterviewQuestion, 
  SkillGap, 
  InterviewAttempt,
  ExtractedSkill,
  JobSkill,
  SkillDiff,
  Decision,
  UserMode
} from "@/types/evaluation";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Strict skill extraction from resume text - NO GUESSING, NO INFERENCE
export function extractResumeSkills(resumeText: string): ExtractedSkill[] {
  const lowerText = resumeText.toLowerCase();
  const skills: ExtractedSkill[] = [];
  
  // Define skill patterns with evidence extraction
  const skillPatterns: { skill: string; patterns: RegExp[] }[] = [
    { skill: "Python", patterns: [/python/gi, /django/gi, /flask/gi, /fastapi/gi] },
    { skill: "JavaScript", patterns: [/javascript/gi, /\bjs\b/gi] },
    { skill: "TypeScript", patterns: [/typescript/gi, /\bts\b/gi] },
    { skill: "React", patterns: [/react/gi, /react\.js/gi, /reactjs/gi] },
    { skill: "Node.js", patterns: [/node\.js/gi, /nodejs/gi, /node/gi] },
    { skill: "Java", patterns: [/\bjava\b/gi] },
    { skill: "C++", patterns: [/c\+\+/gi, /cpp/gi] },
    { skill: "SQL", patterns: [/\bsql\b/gi, /mysql/gi, /postgresql/gi, /postgres/gi] },
    { skill: "MongoDB", patterns: [/mongodb/gi, /mongo/gi] },
    { skill: "AWS", patterns: [/\baws\b/gi, /amazon web services/gi] },
    { skill: "Docker", patterns: [/docker/gi] },
    { skill: "Kubernetes", patterns: [/kubernetes/gi, /k8s/gi] },
    { skill: "Git", patterns: [/\bgit\b/gi, /github/gi, /gitlab/gi] },
    { skill: "REST API", patterns: [/rest api/gi, /restful/gi, /rest/gi] },
    { skill: "GraphQL", patterns: [/graphql/gi] },
    { skill: "Machine Learning", patterns: [/machine learning/gi, /\bml\b/gi] },
    { skill: "Data Analysis", patterns: [/data analysis/gi, /data analyst/gi] },
    { skill: "Agile", patterns: [/agile/gi, /scrum/gi] },
    { skill: "CI/CD", patterns: [/ci\/cd/gi, /continuous integration/gi] },
    { skill: "HTML/CSS", patterns: [/html/gi, /css/gi] },
    { skill: "Vue.js", patterns: [/vue/gi, /vuejs/gi] },
    { skill: "Angular", patterns: [/angular/gi] },
    { skill: "FastAPI", patterns: [/fastapi/gi] },
    { skill: "Django", patterns: [/django/gi] },
    { skill: "Flask", patterns: [/flask/gi] },
    { skill: "TensorFlow", patterns: [/tensorflow/gi] },
    { skill: "PyTorch", patterns: [/pytorch/gi] },
  ];

  // Extract evidence by finding sentences containing the skill
  const sentences = resumeText.split(/[.!?\n]+/).filter(s => s.trim().length > 10);
  
  skillPatterns.forEach(({ skill, patterns }) => {
    for (const pattern of patterns) {
      if (pattern.test(resumeText)) {
        // Find sentence with evidence
        const evidenceSentence = sentences.find(s => 
          patterns.some(p => p.test(s))
        );
        
        if (evidenceSentence) {
          // Determine source
          let source: ExtractedSkill["source"] = "skills";
          const lowerEvidence = evidenceSentence.toLowerCase();
          if (lowerEvidence.includes("project") || lowerEvidence.includes("built") || lowerEvidence.includes("developed")) {
            source = "projects";
          } else if (lowerEvidence.includes("worked") || lowerEvidence.includes("company") || lowerEvidence.includes("intern")) {
            source = "experience";
          } else if (lowerEvidence.includes("certified") || lowerEvidence.includes("certification")) {
            source = "certifications";
          }
          
          // Avoid duplicates
          if (!skills.find(s => s.skill === skill)) {
            skills.push({
              skill,
              evidence: evidenceSentence.trim().substring(0, 150),
              source,
            });
          }
        }
        break;
      }
    }
  });

  return skills;
}

// Extract skills from job description
export function extractJobSkills(jobDescription: string): JobSkill[] {
  const lowerText = jobDescription.toLowerCase();
  const skills: JobSkill[] = [];
  
  const skillKeywords = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "C++",
    "SQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "REST API",
    "GraphQL", "Machine Learning", "Data Analysis", "Agile", "CI/CD",
    "HTML/CSS", "Vue.js", "Angular", "FastAPI", "Django", "Flask",
    "TensorFlow", "PyTorch", "Go", "Rust", "Ruby", "PHP", "Swift"
  ];
  
  // Check for required vs preferred sections
  const requiredSection = lowerText.includes("required") || lowerText.includes("must have") || lowerText.includes("requirements");
  const preferredSection = lowerText.includes("preferred") || lowerText.includes("nice to have") || lowerText.includes("bonus");
  
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      // Determine if required or preferred based on context
      const skillIndex = lowerText.indexOf(skill.toLowerCase());
      const context = lowerText.substring(Math.max(0, skillIndex - 100), skillIndex + 50);
      
      const isPreferred = context.includes("preferred") || context.includes("nice to have") || context.includes("bonus");
      
      if (!skills.find(s => s.skill === skill)) {
        skills.push({
          skill,
          required: !isPreferred,
        });
      }
    }
  });

  return skills;
}

// Calculate skill difference
export function calculateSkillDiff(
  resumeSkills: ExtractedSkill[],
  jobSkills: JobSkill[]
): SkillDiff {
  const resumeSkillNames = resumeSkills.map(s => s.skill.toLowerCase());
  const jobSkillNames = jobSkills.map(s => s.skill.toLowerCase());
  
  const matched = resumeSkills.filter(s => 
    jobSkillNames.includes(s.skill.toLowerCase())
  );
  
  const missing = jobSkills.filter(s => 
    !resumeSkillNames.includes(s.skill.toLowerCase())
  );
  
  const extra = resumeSkills.filter(s => 
    !jobSkillNames.includes(s.skill.toLowerCase())
  );
  
  return { matched, missing, extra };
}

// Calculate readiness score based on skill match
function calculateReadinessScore(skillDiff: SkillDiff, jobSkills: JobSkill[]): number {
  if (jobSkills.length === 0) return 50;
  
  const requiredSkills = jobSkills.filter(s => s.required);
  const preferredSkills = jobSkills.filter(s => !s.required);
  
  const matchedRequired = skillDiff.matched.filter(m => 
    requiredSkills.some(r => r.skill.toLowerCase() === m.skill.toLowerCase())
  ).length;
  
  const matchedPreferred = skillDiff.matched.filter(m => 
    preferredSkills.some(p => p.skill.toLowerCase() === m.skill.toLowerCase())
  ).length;
  
  // Weight: 80% for required skills, 20% for preferred
  const requiredScore = requiredSkills.length > 0 
    ? (matchedRequired / requiredSkills.length) * 80 
    : 40;
  const preferredScore = preferredSkills.length > 0 
    ? (matchedPreferred / preferredSkills.length) * 20 
    : 10;
  
  // Bonus for extra relevant skills
  const extraBonus = Math.min(10, skillDiff.extra.length * 2);
  
  return Math.min(100, Math.round(requiredScore + preferredScore + extraBonus));
}

// Determine decision based on thresholds
function determineDecision(readinessScore: number): Decision {
  if (readinessScore >= 75) return "APPLY";
  if (readinessScore >= 60) return "BORDERLINE";
  return "DO_NOT_APPLY";
}

// Generate skill gaps with learning paths
function generateSkillGaps(missingSkills: JobSkill[]): SkillGap[] {
  return missingSkills.slice(0, 5).map((jobSkill, index) => {
    const skill = jobSkill.skill;
    const importance: SkillGap["importance"] = jobSkill.required 
      ? (index < 2 ? "high" : "medium")
      : "low";
    
    const learningPaths: Record<string, Partial<SkillGap>> = {
      "Python": {
        whyMissing: "Not found in resume skills, projects, or experience",
        whatToLearn: "Python fundamentals, data structures, and common libraries (pandas, numpy)",
        howToPractice: "Build automation scripts, data analysis projects, or REST APIs",
        resumeAddition: "Add Python projects with clear descriptions of what you built",
      },
      "JavaScript": {
        whyMissing: "Not found in resume skills, projects, or experience",
        whatToLearn: "ES6+ syntax, async programming, DOM manipulation",
        howToPractice: "Build interactive web applications, use frameworks like React or Vue",
        resumeAddition: "Include JavaScript projects with live demos or GitHub links",
      },
      "React": {
        whyMissing: "Not found in resume skills, projects, or experience",
        whatToLearn: "Component architecture, hooks, state management, React Router",
        howToPractice: "Build a full-stack app with React frontend and API integration",
        resumeAddition: "Add React projects with deployed URLs and feature descriptions",
      },
      "AWS": {
        whyMissing: "No AWS or cloud experience mentioned in resume",
        whatToLearn: "EC2, S3, Lambda, RDS, IAM basics",
        howToPractice: "Get AWS Cloud Practitioner certification, deploy a project on AWS",
        resumeAddition: "List AWS certifications and projects deployed on AWS infrastructure",
      },
      "Docker": {
        whyMissing: "No containerization experience mentioned in resume",
        whatToLearn: "Dockerfile creation, container orchestration basics, Docker Compose",
        howToPractice: "Containerize an existing application, document the process",
        resumeAddition: "Mention dockerized applications and container deployment experience",
      },
    };
    
    const defaultPath: Partial<SkillGap> = {
      whyMissing: `Not found in resume skills, projects, or experience`,
      whatToLearn: `Core ${skill} concepts, best practices, and common use cases`,
      howToPractice: `Complete online courses, build personal projects using ${skill}`,
      resumeAddition: `Add ${skill} projects with clear descriptions and measurable outcomes`,
    };
    
    const path = learningPaths[skill] || defaultPath;
    
    return {
      skill,
      importance,
      whyMissing: path.whyMissing!,
      whatToLearn: path.whatToLearn!,
      howToPractice: path.howToPractice!,
      resumeAddition: path.resumeAddition!,
    };
  });
}

// Generate reasoning
function generateReasoning(
  decision: Decision,
  score: number,
  skillDiff: SkillDiff
): string[] {
  const matchedCount = skillDiff.matched.length;
  const missingCount = skillDiff.missing.length;
  const requiredMissing = skillDiff.missing.filter(m => m.required).length;
  
  if (decision === "APPLY") {
    return [
      `Strong alignment with ${matchedCount} required technical skills`,
      `Readiness score of ${score}% exceeds the 75% threshold`,
      skillDiff.extra.length > 0 
        ? `Additional strengths: ${skillDiff.extra.slice(0, 3).map(s => s.skill).join(", ")}`
        : "Profile demonstrates solid technical foundation",
      "Proceed to interview preparation to maximize success",
    ];
  }
  
  if (decision === "BORDERLINE") {
    return [
      `Partial alignment with ${matchedCount} skills, but missing ${requiredMissing} required skills`,
      `Readiness score of ${score}% is in the borderline range (60-75%)`,
      "Consider addressing key skill gaps before applying",
      "If urgent, apply but prepare to explain learning plan for missing skills",
    ];
  }
  
  return [
    `Missing ${requiredMissing} critical required skills for this position`,
    `Readiness score of ${score}% is below the 60% threshold`,
    skillDiff.missing.length > 0 
      ? `Priority gaps: ${skillDiff.missing.slice(0, 3).map(m => m.skill).join(", ")}`
      : "General technical depth needs improvement",
    "Focus on skill development before applying to similar roles",
  ];
}

// Generate interview questions based ONLY on matched skills
function generateInterviewQuestions(
  matchedSkills: ExtractedSkill[],
  missingSkills: JobSkill[]
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  
  // Technical questions based on matched skills
  matchedSkills.slice(0, 3).forEach(skill => {
    questions.push({
      id: generateId(),
      type: "technical",
      question: `Explain a challenging problem you solved using ${skill.skill}. Walk me through your approach and the outcome.`,
      context: `Based on your experience: "${skill.evidence}"`,
      relatedSkill: skill.skill,
    });
  });
  
  // Behavioral questions
  questions.push({
    id: generateId(),
    type: "behavioral",
    question: "Tell me about a time you had to learn a new technology quickly to meet a deadline. How did you approach it?",
    context: "Assesses adaptability and learning velocity",
  });
  
  questions.push({
    id: generateId(),
    type: "behavioral",
    question: "Describe a situation where you disagreed with a technical decision. How did you handle it?",
    context: "Evaluates communication and collaboration skills",
  });
  
  // Resume-based question
  if (matchedSkills.length > 0) {
    questions.push({
      id: generateId(),
      type: "resume",
      question: "Walk me through your most impactful project. What was your role and what did you learn?",
      context: "Evaluates project experience and self-reflection",
    });
  }
  
  // Weak area question based on missing skills
  if (missingSkills.length > 0) {
    const topMissing = missingSkills[0];
    questions.push({
      id: generateId(),
      type: "weak-area",
      question: `This role requires ${topMissing.skill}. How would you approach learning it quickly if you were selected?`,
      context: "Probes awareness of gaps and learning strategy",
      relatedSkill: topMissing.skill,
    });
  }
  
  return questions;
}

// Main evaluation function
export function evaluateReadiness(
  resumeText: string, 
  jobDescription: string,
  mode: UserMode = "student",
  candidateName?: string
): EvaluationResult {
  // Step 1: Extract skills with evidence (STRICT - no guessing)
  const extractedResumeSkills = extractResumeSkills(resumeText);
  
  // Step 2: Extract job requirements
  const jobRequiredSkills = extractJobSkills(jobDescription);
  
  // Step 3: Calculate skill difference
  const skillDiff = calculateSkillDiff(extractedResumeSkills, jobRequiredSkills);
  
  // Step 4: Calculate readiness score
  const readinessScore = calculateReadinessScore(skillDiff, jobRequiredSkills);
  
  // Step 5: Determine decision (60/75 thresholds)
  const decision = determineDecision(readinessScore);
  
  // Step 6: Generate skill gaps with learning paths
  const skillGaps = generateSkillGaps(skillDiff.missing);
  
  // Step 7: Generate reasoning
  const reasoning = generateReasoning(decision, readinessScore, skillDiff);
  
  // Step 8: Generate interview questions (only if score >= 75)
  const interviewQuestions = readinessScore >= 75 
    ? generateInterviewQuestions(skillDiff.matched, skillDiff.missing)
    : [];
  
  return {
    id: generateId(),
    mode,
    candidateName,
    decision,
    readinessScore,
    extractedResumeSkills,
    jobRequiredSkills,
    skillDiff,
    reasoning,
    skillGaps,
    interviewQuestions,
    cvSummary: `Profile with ${extractedResumeSkills.length} verified skills`,
    jobSummary: `Role requiring ${jobRequiredSkills.filter(s => s.required).length} required and ${jobRequiredSkills.filter(s => !s.required).length} preferred skills`,
    createdAt: new Date(),
  };
}

// Evaluate interview answer
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
