import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { Decision } from "@/types/evaluation";

interface DecisionBadgeProps {
  decision: Decision;
}

export function DecisionBadge({ decision }: DecisionBadgeProps) {
  const isApply = decision === "APPLY";
  const isBorderline = decision === "BORDERLINE";

  const getStyles = () => {
    if (isApply) return "gradient-success text-success-foreground shadow-glow";
    if (isBorderline) return "bg-warning text-warning-foreground";
    return "bg-danger text-danger-foreground";
  };

  const getIcon = () => {
    if (isApply) return <CheckCircle2 className="h-6 w-6" />;
    if (isBorderline) return <AlertTriangle className="h-6 w-6" />;
    return <XCircle className="h-6 w-6" />;
  };

  const getLabel = () => {
    if (isApply) return "APPLY";
    if (isBorderline) return "BORDERLINE";
    return "DO NOT APPLY";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-lg ${getStyles()}`}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </motion.div>
  );
}
