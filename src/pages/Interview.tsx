import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2,
  Loader2,
  Target
} from "lucide-react";
import type { EvaluationResult, InterviewQuestion, InterviewAttempt } from "@/types/evaluation";
import { evaluateAnswer } from "@/lib/mockAI";
import { saveInterviewAttempt } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const Interview = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  const result = location.state?.result as EvaluationResult | undefined;
  const questions = result?.interviewQuestions || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<InterviewAttempt["feedback"] | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  if (!result || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">No interview questions found</h1>
            <Link to="/evaluate">
              <Button variant="hero">Start New Evaluation</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((completedQuestions.size) / questions.length) * 100;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Answer required",
        description: "Please type your answer before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const evaluation = evaluateAnswer(currentQuestion.question, answer);
    setFeedback(evaluation);

    // Save the attempt
    saveInterviewAttempt(result.id, {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer,
      feedback: evaluation,
    });

    setCompletedQuestions((prev) => new Set([...prev, currentQuestion.id]));
    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setAnswer("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setFeedback(null);
    setAnswer("");
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getTypeColor = (type: InterviewQuestion["type"]) => {
    switch (type) {
      case "technical":
        return "bg-primary/10 text-primary";
      case "behavioral":
        return "bg-accent/10 text-accent";
      case "resume":
        return "bg-warning/10 text-warning";
      case "weak-area":
        return "bg-danger/10 text-danger";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <Link to={`/result/${result.id}`} state={{ result }}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Results
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-success"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl border border-border p-8 mb-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(currentQuestion.type)}`}>
                      {currentQuestion.type.charAt(0).toUpperCase() + currentQuestion.type.slice(1)}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-3">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.context && (
                  <p className="text-sm text-muted-foreground mb-6">
                    💡 {currentQuestion.context}
                  </p>
                )}

                {!feedback ? (
                  <>
                    <Textarea
                      placeholder="Type your answer here... Be specific and use examples from your experience."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="min-h-[200px] resize-none mb-6"
                    />

                    <Button
                      variant="hero"
                      size="lg"
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim() || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Target className="h-5 w-5" />
                          Submit Answer
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Score Display */}
                    <div className="p-6 rounded-xl bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Answer Evaluation</h3>
                        <span className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                          {feedback.overallScore}%
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Clarity</p>
                          <p className={`text-lg font-semibold ${getScoreColor(feedback.clarity)}`}>
                            {feedback.clarity}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Technical Depth</p>
                          <p className={`text-lg font-semibold ${getScoreColor(feedback.technicalDepth)}`}>
                            {feedback.technicalDepth}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Relevance</p>
                          <p className={`text-lg font-semibold ${getScoreColor(feedback.relevance)}`}>
                            {feedback.relevance}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {feedback.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Improvement Suggestions</h4>
                        <ul className="space-y-2">
                          {feedback.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Your Answer */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Your Answer</h4>
                      <p className="text-sm text-muted-foreground bg-secondary/30 p-4 rounded-lg">
                        {answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {feedback && (
                <Button
                  variant={currentIndex === questions.length - 1 ? "success" : "hero"}
                  onClick={handleNextQuestion}
                  disabled={currentIndex === questions.length - 1}
                >
                  {currentIndex === questions.length - 1 ? (
                    "Complete!"
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Completion Message */}
            {completedQuestions.size === questions.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-8 rounded-2xl gradient-success text-center"
              >
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success-foreground" />
                <h2 className="text-2xl font-bold text-success-foreground mb-2">
                  Interview Practice Complete!
                </h2>
                <p className="text-success-foreground/80 mb-6">
                  You've practiced all {questions.length} questions. Review your results in the analytics dashboard.
                </p>
                <Link to="/analytics">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="bg-background text-foreground hover:bg-background/90"
                  >
                    View Analytics
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Interview;
