import { Link } from "react-router-dom";
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
  ArrowRight
} from "lucide-react";

const Landing = () => {
  const steps = [
    {
      icon: FileText,
      title: "Upload Your CV",
      description: "Simply upload your resume in PDF format",
    },
    {
      icon: Target,
      title: "Paste Job Description",
      description: "Copy and paste the job posting you're considering",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our decision agents analyze your fit in seconds",
    },
    {
      icon: CheckCircle2,
      title: "Get Your Decision",
      description: "Receive a clear APPLY or DO NOT APPLY verdict",
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Decision Intelligence",
      description: "Not generic advice. A clear, defensible decision backed by data.",
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description: "Know exactly what skills you need and how to acquire them.",
    },
    {
      icon: MessageSquare,
      title: "Interview Preparation",
      description: "Practice with AI-generated questions tailored to your profile.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  <Brain className="h-4 w-4" />
                  AI-Powered Decision Intelligence
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              >
                Should You Apply?
                <br />
                <span className="text-gradient">Know Before You Waste Time.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              >
                Stop guessing. Our AI decision agents analyze your CV against job descriptions 
                and give you a clear verdict: <strong>APPLY</strong> or <strong>DO NOT APPLY</strong>. 
                Plus interview prep if you should.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link to="/evaluate">
                  <Button variant="hero" size="xl" className="group">
                    Evaluate My Readiness
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button variant="outline" size="xl">
                    View Analytics
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Background decorations */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* How It Works */}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-14 w-14 rounded-2xl gradient-hero text-primary-foreground mb-4">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <span className="absolute -top-2 -left-2 flex items-center justify-center h-7 w-7 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
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
                Not Just Advice. Decisions.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for CS students applying to software engineering roles
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 text-accent mb-6">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
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
                Ready to Make Better Decisions?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Stop applying blindly. Know your chances before you invest your time.
              </p>
              <Link to="/evaluate">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  Start Your Evaluation
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
