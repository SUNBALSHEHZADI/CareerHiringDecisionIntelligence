import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { evaluateReadiness } from "@/lib/mockAI";
import { saveEvaluation } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const Evaluate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".txt")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or TXT file",
        variant: "destructive",
      });
      return;
    }

    setCvFileName(file.name);

    // For demo purposes, we'll extract text from the file
    if (file.name.endsWith(".txt")) {
      const text = await file.text();
      setCvText(text);
    } else {
      // For PDF, we'll use a placeholder since we can't parse PDFs client-side without a library
      // In production, this would use a PDF parser
      setCvText(`[CV Content from ${file.name}]
        
Skills: JavaScript, TypeScript, React, Node.js, Python, SQL, Git
Education: B.S. Computer Science
Experience: 2 internships, multiple projects
Projects: Full-stack web applications, REST APIs, Database design`);
      
      toast({
        title: "CV uploaded",
        description: "For demo purposes, sample CV data has been loaded. In production, your actual PDF would be parsed.",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleEvaluate = async () => {
    if (!cvText.trim()) {
      toast({
        title: "CV required",
        description: "Please upload your CV or paste your resume content",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste the job description you want to evaluate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const result = evaluateReadiness(cvText, jobDescription);
      saveEvaluation(result);

      toast({
        title: "Evaluation complete!",
        description: `Decision: ${result.decision} (${result.readinessScore}% readiness)`,
      });

      navigate(`/result/${result.id}`, { state: { result } });
    } catch (error) {
      toast({
        title: "Evaluation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = cvText.trim() && jobDescription.trim();

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Evaluate Your Readiness
              </h1>
              <p className="text-lg text-muted-foreground">
                Upload your CV and paste the job description to get your decision
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* CV Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-card rounded-2xl border border-border p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Your CV</h2>
                      <p className="text-sm text-muted-foreground">Upload PDF or paste text</p>
                    </div>
                  </div>

                  {/* Drag and Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-4 ${
                      dragActive
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    {cvFileName ? (
                      <p className="text-sm font-medium text-foreground">{cvFileName}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Drop your CV here
                        </p>
                        <p className="text-xs text-muted-foreground">PDF or TXT format</p>
                      </>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">or paste text</span>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={cvText}
                    onChange={(e) => {
                      setCvText(e.target.value);
                      setCvFileName("");
                    }}
                    className="mt-4 min-h-[200px] resize-none"
                  />
                </div>
              </motion.div>

              {/* Job Description Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-card rounded-2xl border border-border p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10 text-accent">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Job Description</h2>
                      <p className="text-sm text-muted-foreground">Paste the full job posting</p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Paste the job description here...

Example:
We're looking for a Software Engineer to join our team. 
Requirements:
- 1-2 years of experience with React and TypeScript
- Familiarity with REST APIs and databases
- Strong problem-solving skills
- CS degree or equivalent"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[350px] resize-none"
                  />
                </div>
              </motion.div>
            </div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 text-center"
            >
              {!isFormValid && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Both CV and job description are required</span>
                </div>
              )}

              <Button
                variant="hero"
                size="xl"
                onClick={handleEvaluate}
                disabled={!isFormValid || isLoading}
                className="min-w-[280px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Evaluate My Readiness
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Evaluate;
