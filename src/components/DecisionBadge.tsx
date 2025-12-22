import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface DecisionBadgeProps {
  decision: "APPLY" | "DO_NOT_APPLY";
}

export function DecisionBadge({ decision }: DecisionBadgeProps) {
  const isApply = decision === "APPLY";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-lg ${
        isApply
          ? "gradient-success text-success-foreground shadow-glow"
          : "bg-danger text-danger-foreground"
      }`}
    >
      {isApply ? (
        <CheckCircle2 className="h-6 w-6" />
      ) : (
        <XCircle className="h-6 w-6" />
      )}
      <span>{isApply ? "APPLY" : "DO NOT APPLY"}</span>
    </motion.div>
  );
}
