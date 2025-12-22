import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Plus, 
  Users, 
  FileText, 
  Upload, 
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { evaluateReadiness } from "@/lib/mockAI";
import { saveEvaluation } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import type { EvaluationResult } from "@/types/evaluation";
import { Link } from "react-router-dom";

const HRDashboard = () => {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [candidateResumes, setCandidateResumes] = useState<{ name: string; text: string }[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [step, setStep] = useState<"job" | "candidates" | "results">("job");

  const handleAddCandidate = () => {
    setCandidateResumes([...candidateResumes, { name: `Candidate ${candidateResumes.length + 1}`, text: "" }]);
  };

  const handleCandidateChange = (index: number, field: "name" | "text", value: string) => {
    const updated = [...candidateResumes];
    updated[index][field] = value;
    setCandidateResumes(updated);
  };

  const handleEvaluateAll = async () => {
    if (!jobDescription.trim() || candidateResumes.length === 0) {
      toast({ title: "Missing data", description: "Add job description and at least one candidate", variant: "destructive" });
      return;
    }

    setIsEvaluating(true);
    const results: EvaluationResult[] = [];

    for (const candidate of candidateResumes) {
      if (candidate.text.trim()) {
        await new Promise(r => setTimeout(r, 500));
        const result = evaluateReadiness(candidate.text, jobDescription, "hr", candidate.name);
        saveEvaluation(result);
        results.push(result);
      }
    }

    setEvaluations(results.sort((a, b) => b.readinessScore - a.readinessScore));
    setIsEvaluating(false);
    setStep("results");
    toast({ title: "Evaluation complete!", description: `Evaluated ${results.length} candidates` });
  };

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                HR Mode
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">HR Dashboard</h1>
              <p className="text-lg text-muted-foreground">Evaluate multiple candidates against a job role</p>
            </div>

            {step === "job" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" /> Step 1: Define Job Role
                </h2>
                <Input placeholder="Job Title (e.g., Software Engineer)" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="mb-4" />
                <Textarea placeholder="Paste the full job description with required and preferred skills..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="min-h-[200px] mb-6" />
                <Button variant="hero" onClick={() => setStep("candidates")} disabled={!jobDescription.trim()}>
                  Next: Add Candidates <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {step === "candidates" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <Users className="h-5 w-5 text-accent" /> Step 2: Add Candidate Resumes
                </h2>
                <div className="space-y-4 mb-6">
                  {candidateResumes.map((candidate, index) => (
                    <div key={index} className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <Input placeholder="Candidate Name" value={candidate.name} onChange={(e) => handleCandidateChange(index, "name", e.target.value)} className="mb-2" />
                      <Textarea placeholder="Paste resume text..." value={candidate.text} onChange={(e) => handleCandidateChange(index, "text", e.target.value)} className="min-h-[120px]" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleAddCandidate}><Plus className="h-4 w-4" /> Add Candidate</Button>
                  <Button variant="hero" onClick={handleEvaluateAll} disabled={isEvaluating || candidateResumes.length === 0}>
                    {isEvaluating ? <><Loader2 className="h-5 w-5 animate-spin" /> Evaluating...</> : <>Evaluate All Candidates</>}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "results" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-success" /> Candidate Rankings
                  </h2>
                  <div className="space-y-4">
                    {evaluations.map((eval_, index) => (
                      <div key={eval_.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                          <div>
                            <p className="font-semibold text-foreground">{eval_.candidateName || "Candidate"}</p>
                            <p className="text-sm text-muted-foreground">{eval_.skillDiff.matched.length} matched / {eval_.skillDiff.missing.length} missing</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            eval_.decision === "APPLY" ? "bg-success/10 text-success" : 
                            eval_.decision === "BORDERLINE" ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                          }`}>
                            {eval_.readinessScore}%
                          </span>
                          {eval_.decision === "APPLY" ? <CheckCircle2 className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-danger" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => { setStep("job"); setEvaluations([]); setCandidateResumes([]); }}>New Evaluation</Button>
                  <Link to="/analytics"><Button variant="hero">View Analytics</Button></Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HRDashboard;
