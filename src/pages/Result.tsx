import { useLocation, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ScoreRing";
import { DecisionBadge } from "@/components/DecisionBadge";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  CheckCircle2,
  XCircle,
  Plus,
  FileText
} from "lucide-react";
import type { EvaluationResult, Decision } from "@/types/evaluation";
import { saveFeedback } from "@/lib/storage";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const result = location.state?.result as EvaluationResult | undefined;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">No evaluation found</h1>
            <Link to="/evaluate">
              <Button variant="hero">Start New Evaluation</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleFeedback = (trusted: boolean) => {
    saveFeedback(result.id, trusted);
    setFeedbackGiven(true);
    toast({
      title: "Thank you for your feedback!",
      description: trusted 
        ? "We're glad you found this helpful."
        : "We'll work on improving our analysis.",
    });
  };

  const isApply = result.decision === "APPLY";
  const isBorderline = result.decision === "BORDERLINE";

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Decision Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <DecisionBadge decision={result.decision} />

              <div className="mt-8 flex justify-center">
                <ScoreRing score={result.readinessScore} />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 text-lg text-muted-foreground"
              >
                {isApply
                  ? "You're ready to apply! Prepare for your interview below."
                  : isBorderline
                  ? "You're close! Consider addressing key gaps or proceed with caution."
                  : "Focus on building these skills before applying."}
              </motion.p>
            </motion.div>

            {/* SKILL DIFF PANEL - SHOWN BEFORE DECISION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-8 mb-8"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                Skill Comparison Panel
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Matched Skills */}
                <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <h3 className="font-semibold text-foreground">Matched Skills</h3>
                    <span className="ml-auto text-sm font-medium text-success">
                      {result.skillDiff.matched.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {result.skillDiff.matched.length > 0 ? (
                      result.skillDiff.matched.map((skill, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-foreground">{skill.skill}</p>
                          <p className="text-muted-foreground text-xs mt-1 italic">
                            "{skill.evidence.substring(0, 80)}..."
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No matched skills found</p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-xl bg-danger/5 border border-danger/20">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-5 w-5 text-danger" />
                    <h3 className="font-semibold text-foreground">Missing Skills</h3>
                    <span className="ml-auto text-sm font-medium text-danger">
                      {result.skillDiff.missing.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {result.skillDiff.missing.length > 0 ? (
                      result.skillDiff.missing.map((skill, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{skill.skill}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              skill.required 
                                ? "bg-danger/10 text-danger" 
                                : "bg-warning/10 text-warning"
                            }`}>
                              {skill.required ? "Required" : "Preferred"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No missing skills!</p>
                    )}
                  </div>
                </div>

                {/* Extra Skills */}
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-foreground">Extra Skills</h3>
                    <span className="ml-auto text-sm font-medium text-accent">
                      {result.skillDiff.extra.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {result.skillDiff.extra.length > 0 ? (
                      result.skillDiff.extra.map((skill, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-foreground">{skill.skill}</p>
                          <p className="text-muted-foreground text-xs mt-1">
                            Additional strength
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No extra skills</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reasoning Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-8 mb-8"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                Decision Reasoning
              </h2>
              <ul className="space-y-3">
                {result.reasoning.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-secondary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{reason}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Skill Gaps Section (if not APPLY) */}
            {!isApply && result.skillGaps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-card rounded-2xl border border-border p-8 mb-8"
              >
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-warning/10 text-warning">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  Skill Gap Learning Path
                </h2>
                <div className="space-y-4">
                  {result.skillGaps.map((gap, index) => (
                    <motion.div
                      key={gap.skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 rounded-xl bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">{gap.skill}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            gap.importance === "high"
                              ? "bg-danger/10 text-danger"
                              : gap.importance === "medium"
                              ? "bg-warning/10 text-warning"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {gap.importance} priority
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground font-medium">Why missing:</p>
                          <p className="text-foreground">{gap.whyMissing}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">What to learn:</p>
                          <p className="text-foreground">{gap.whatToLearn}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">How to practice:</p>
                          <p className="text-foreground">{gap.howToPractice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Resume addition:</p>
                          <p className="text-foreground">{gap.resumeAddition}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Interview Prep Section (if APPLY) */}
            {isApply && result.interviewQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-card rounded-2xl border border-border p-8 mb-8"
              >
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10 text-accent">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  Interview Preparation
                </h2>
                <p className="text-muted-foreground mb-6">
                  We've generated {result.interviewQuestions.length} practice questions based on your <strong>matched skills only</strong>.
                </p>
                <Link to={`/interview/${result.id}`} state={{ result }}>
                  <Button variant="success" size="lg" className="w-full sm:w-auto">
                    Start Interview Practice
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Feedback Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
                Do you trust this decision?
              </h2>
              {feedbackGiven ? (
                <p className="text-center text-muted-foreground">
                  Thank you for your feedback! Your input helps us improve.
                </p>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleFeedback(true)}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    Yes, I trust it
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleFeedback(false)}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-5 w-5" />
                    No, I don't
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/evaluate">
                <Button variant="outline" size="lg">
                  <TrendingUp className="h-5 w-5" />
                  New Evaluation
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="secondary" size="lg">
                  View Analytics
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Result;
