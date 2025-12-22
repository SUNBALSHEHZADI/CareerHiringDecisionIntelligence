import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Target, 
  FileText, 
  Brain, 
  CheckCircle2, 
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Users,
  GraduationCap,
  Briefcase,
  Shield,
  BarChart3,
  Zap
} from "lucide-react";
import { saveUserMode } from "@/lib/storage";

const Landing = () => {
  const navigate = useNavigate();

  const handleModeSelect = (mode: "student" | "hr") => {
    saveUserMode(mode);
    navigate(mode === "student" ? "/evaluate" : "/hr/dashboard");
  };

  const studentFeatures = [
    "Upload resume (PDF/Text)",
    "Paste job description",
    "Get APPLY / BORDERLINE / DO NOT APPLY decision",
    "View extracted skills with evidence",
    "Skill gap learning path",
    "Interview practice (if ready)",
  ];

  const hrFeatures = [
    "Create job roles with requirements",
    "Upload multiple candidate resumes",
    "Evaluate all candidates automatically",
    "Rank candidates by readiness score",
    "Export evaluation reports (PDF)",
    "ATS integration ready",
  ];

  const coreValues = [
    {
      icon: Shield,
      title: "Evidence-Based Only",
      description: "Skills extracted ONLY from resume text. No guessing, no inference, no assumptions.",
    },
    {
      icon: Brain,
      title: "Full Transparency",
      description: "See exactly how decisions are made. Skill diff shown BEFORE any recommendation.",
    },
    {
      icon: Zap,
      title: "Actionable Intelligence",
      description: "Not generic advice. Clear decisions with specific learning paths and actions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  <Brain className="h-4 w-4" />
                  Career & Hiring Decision Intelligence
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              >
                Hiring Decisions
                <br />
                <span className="text-gradient">Powered by Evidence.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              >
                One job role, one resume → objective readiness decision.
                No hallucinated skills. No hidden logic. Full transparency.
              </motion.p>
            </div>
          </div>

          {/* Background decorations */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Mode Selection */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Select Your Mode
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Same powerful AI engine, tailored workflows for your role
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Student Mode */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group"
              >
                <div 
                  onClick={() => handleModeSelect("student")}
                  className="cursor-pointer p-8 rounded-2xl bg-background border-2 border-border hover:border-primary transition-all duration-300 h-full flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center h-14 w-14 rounded-xl gradient-hero text-primary-foreground">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Student Mode</h3>
                      <p className="text-sm text-muted-foreground">Job seekers & Career switchers</p>
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {studentFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-foreground">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="hero" size="lg" className="w-full group-hover:shadow-lg">
                    Enter Student Mode
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>

              {/* HR Mode */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group"
              >
                <div 
                  onClick={() => handleModeSelect("hr")}
                  className="cursor-pointer p-8 rounded-2xl bg-background border-2 border-border hover:border-accent transition-all duration-300 h-full flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-accent text-accent-foreground">
                      <Briefcase className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">HR Mode</h3>
                      <p className="text-sm text-muted-foreground">Recruiters & Hiring Managers</p>
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {hrFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-foreground">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="outline" size="lg" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground group-hover:shadow-lg">
                    Enter HR Mode
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Core Philosophy
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Not a resume matcher. This is decision intelligence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-6">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Student */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From upload to decision in under 60 seconds
              </p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {[
                { step: 1, icon: FileText, title: "Upload Resume", desc: "PDF or paste text" },
                { step: 2, icon: Target, title: "Paste Job Description", desc: "Full JD text" },
                { step: 3, icon: Brain, title: "Skill Extraction", desc: "Evidence-based only" },
                { step: 4, icon: BarChart3, title: "Skill Diff View", desc: "Matched / Missing / Extra" },
                { step: 5, icon: CheckCircle2, title: "Get Decision", desc: "Apply / Borderline / Don't" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-2xl gradient-hero text-primary-foreground mb-4">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center h-7 w-7 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                    {item.step}
                  </span>
                  <h3 className="text-md font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center p-12 rounded-3xl gradient-hero text-primary-foreground"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready for Objective Decisions?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Stop guessing. Get evidence-based hiring intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={() => handleModeSelect("student")}
                  variant="secondary" 
                  size="xl"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  <GraduationCap className="h-5 w-5" />
                  I'm a Candidate
                </Button>
                <Button 
                  onClick={() => handleModeSelect("hr")}
                  variant="outline" 
                  size="xl"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Briefcase className="h-5 w-5" />
                  I'm Hiring
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
