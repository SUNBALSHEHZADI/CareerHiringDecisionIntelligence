import { memo, useCallback, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  disabled?: boolean;
}

export const ResumeUpload = memo(function ResumeUpload({ 
  onTextExtracted, 
  disabled 
}: ResumeUploadProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.type === "text/plain") {
      return await file.text();
    }

    // For PDF files - basic text extraction hint
    // In production, this would use a PDF parsing library or API
    if (file.type === "application/pdf") {
      toast({
        title: "PDF Processing",
        description: "For best results with PDF, please paste the resume text directly. PDF text extraction is limited in browser.",
        variant: "default",
      });
      // Return placeholder - user should paste text
      return `[PDF uploaded: ${file.name}]\n\nPlease paste the resume text content below for accurate skill extraction.`;
    }

    // For Word documents
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword") {
      toast({
        title: "Word Document",
        description: "For best results, please copy and paste the resume text directly.",
        variant: "default",
      });
      return `[Document uploaded: ${file.name}]\n\nPlease paste the resume text content below for accurate skill extraction.`;
    }

    throw new Error("Unsupported file type");
  }, [toast]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or text file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await extractTextFromFile(file);
      setUploadedFile(file.name);
      onTextExtracted(text, file.name);
      toast({
        title: "File uploaded",
        description: `${file.name} has been processed.`,
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Could not extract text from the file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [extractTextFromFile, onTextExtracted, toast]);

  const handleClear = useCallback(() => {
    setUploadedFile(null);
    onTextExtracted("", "");
  }, [onTextExtracted]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            disabled={disabled || isProcessing}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isProcessing}
            className="w-full cursor-pointer"
            asChild
          >
            <span>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Resume (PDF/Word/TXT)
                </>
              )}
            </span>
          </Button>
        </label>
      </div>

      {uploadedFile && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border">
          <FileText className="h-4 w-4 text-primary" />
          <span className="flex-1 text-sm text-foreground truncate">{uploadedFile}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Supported: PDF, Word (.doc, .docx), Text files. Max 5MB.
        For best results, paste resume text directly.
      </p>
    </div>
  );
});

export default ResumeUpload;
