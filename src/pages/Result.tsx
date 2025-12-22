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
  BookOpen
} from "lucide-react";
import type { EvaluationResult } from "@/types/evaluation";
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

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
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
                  : "Focus on building these skills before applying."}
              </motion.p>
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

            {/* Skill Gaps Section (if DO NOT APPLY) */}
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
                  Skill Gaps to Address
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
                      <div className="flex items-center justify-between mb-2">
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
                      <p className="text-sm text-muted-foreground">{gap.action}</p>
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
                  We've generated {result.interviewQuestions.length} practice questions based on your profile and the job requirements.
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
