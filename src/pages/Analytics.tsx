import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Target, 
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { getAnalytics } from "@/lib/storage";
import { useMemo } from "react";

const Analytics = () => {
  const analytics = useMemo(() => getAnalytics(), []);

  const stats = [
    {
      label: "Total Evaluations",
      value: analytics.totalEvaluations,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Apply Rate",
      value: analytics.totalEvaluations > 0 
        ? `${Math.round((analytics.applyCount / analytics.totalEvaluations) * 100)}%`
        : "0%",
      icon: TrendingUp,
      color: "bg-success/10 text-success",
    },
    {
      label: "Avg. Readiness",
      value: `${analytics.averageReadinessScore}%`,
      icon: Target,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Interview Attempts",
      value: analytics.interviewAttempts,
      icon: MessageSquare,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Trust Score",
      value: `${analytics.trustScore}%`,
      icon: ThumbsUp,
      color: "bg-primary/10 text-primary",
    },
  ];

  const hasData = analytics.totalEvaluations > 0;

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Track your evaluation history and performance metrics
              </p>
            </div>

            {!hasData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center py-20 bg-card rounded-2xl border border-border"
              >
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                  No Data Yet
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Start your first evaluation to see analytics. Your data will be stored locally and displayed here.
                </p>
                <Link to="/evaluate">
                  <Button variant="hero" size="lg">
                    Start First Evaluation
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-card rounded-xl border border-border p-6"
                    >
                      <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${stat.color} mb-4`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Decision Distribution */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card rounded-2xl border border-border p-8"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Decision Distribution
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">APPLY</span>
                          <span className="text-sm text-muted-foreground">
                            {analytics.applyCount} ({analytics.totalEvaluations > 0 
                              ? Math.round((analytics.applyCount / analytics.totalEvaluations) * 100) 
                              : 0}%)
                          </span>
                        </div>
                        <div className="h-4 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full gradient-success"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${analytics.totalEvaluations > 0 
                                ? (analytics.applyCount / analytics.totalEvaluations) * 100 
                                : 0}%` 
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">DO NOT APPLY</span>
                          <span className="text-sm text-muted-foreground">
                            {analytics.doNotApplyCount} ({analytics.totalEvaluations > 0 
                              ? Math.round((analytics.doNotApplyCount / analytics.totalEvaluations) * 100) 
                              : 0}%)
                          </span>
                        </div>
                        <div className="h-4 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-danger"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${analytics.totalEvaluations > 0 
                                ? (analytics.doNotApplyCount / analytics.totalEvaluations) * 100 
                                : 0}%` 
                            }}
                            transition={{ duration: 1, delay: 0.6 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Common Skill Gaps */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card rounded-2xl border border-border p-8"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      Most Common Skill Gaps
                    </h2>
                    {analytics.commonSkillGaps.length > 0 ? (
                      <div className="space-y-4">
                        {analytics.commonSkillGaps.map((gap, index) => (
                          <motion.div
                            key={gap.skill}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                          >
                            <span className="font-medium text-foreground">{gap.skill}</span>
                            <span className="text-sm text-muted-foreground px-3 py-1 bg-background rounded-full">
                              {gap.count} {gap.count === 1 ? "occurrence" : "occurrences"}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No skill gaps recorded yet
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <Link to="/evaluate">
                    <Button variant="hero" size="lg">
                      New Evaluation
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
