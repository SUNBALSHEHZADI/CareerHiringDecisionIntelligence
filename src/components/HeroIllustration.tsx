import { memo } from "react";
import { motion } from "framer-motion";

export const HeroIllustration = memo(function HeroIllustration() {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewBox="0 0 400 300"
      className="w-full max-w-lg mx-auto"
      aria-hidden="true"
    >
      {/* Background shapes */}
      <motion.ellipse
        cx="200"
        cy="260"
        rx="180"
        ry="20"
        className="fill-muted/30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      
      {/* Resume document */}
      <motion.g
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <rect x="80" y="60" width="100" height="130" rx="8" className="fill-card stroke-border" strokeWidth="2" />
        <rect x="95" y="80" width="50" height="6" rx="3" className="fill-primary/60" />
        <rect x="95" y="95" width="70" height="4" rx="2" className="fill-muted" />
        <rect x="95" y="105" width="60" height="4" rx="2" className="fill-muted" />
        <rect x="95" y="115" width="65" height="4" rx="2" className="fill-muted" />
        <rect x="95" y="130" width="40" height="4" rx="2" className="fill-muted" />
        <rect x="95" y="145" width="55" height="4" rx="2" className="fill-muted" />
        <rect x="95" y="160" width="45" height="4" rx="2" className="fill-muted" />
      </motion.g>

      {/* Job description */}
      <motion.g
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <rect x="220" y="60" width="100" height="130" rx="8" className="fill-card stroke-border" strokeWidth="2" />
        <rect x="235" y="80" width="60" height="6" rx="3" className="fill-accent-foreground/60" />
        <rect x="235" y="95" width="70" height="4" rx="2" className="fill-muted" />
        <rect x="235" y="105" width="55" height="4" rx="2" className="fill-muted" />
        <rect x="235" y="115" width="65" height="4" rx="2" className="fill-muted" />
        <rect x="235" y="130" width="50" height="4" rx="2" className="fill-muted" />
        <rect x="235" y="145" width="60" height="4" rx="2" className="fill-muted" />
        <rect x="235" y="160" width="40" height="4" rx="2" className="fill-muted" />
      </motion.g>

      {/* Connection arrows */}
      <motion.path
        d="M185 125 L200 125 L200 200 L215 200"
        className="stroke-primary"
        strokeWidth="2"
        strokeDasharray="5,5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />

      {/* AI Processing circle */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
      >
        <circle cx="200" cy="200" r="30" className="fill-primary/10 stroke-primary" strokeWidth="2" />
        <motion.path
          d="M188 200 L196 208 L212 192"
          className="stroke-success"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        />
      </motion.g>

      {/* Skill match indicators */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1.3 }}
      >
        <circle cx="100" cy="210" r="8" className="fill-success/20 stroke-success" strokeWidth="2" />
        <circle cx="130" cy="220" r="6" className="fill-success/20 stroke-success" strokeWidth="2" />
        <circle cx="115" cy="235" r="5" className="fill-warning/20 stroke-warning" strokeWidth="2" />
      </motion.g>

      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1.4 }}
      >
        <circle cx="300" cy="210" r="8" className="fill-success/20 stroke-success" strokeWidth="2" />
        <circle cx="270" cy="220" r="6" className="fill-success/20 stroke-success" strokeWidth="2" />
        <circle cx="285" cy="235" r="5" className="fill-danger/20 stroke-danger" strokeWidth="2" />
      </motion.g>

      {/* Labels */}
      <text x="130" y="50" textAnchor="middle" className="fill-muted-foreground text-xs font-medium">Resume</text>
      <text x="270" y="50" textAnchor="middle" className="fill-muted-foreground text-xs font-medium">Job</text>
      <text x="200" y="255" textAnchor="middle" className="fill-primary text-sm font-semibold">Match Analysis</text>
    </motion.svg>
  );
});

export default HeroIllustration;
