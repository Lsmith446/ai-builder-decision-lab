"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function FilledCheck() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1 text-xs font-label font-medium text-success-text"
    >
      <Check size={11} strokeWidth={2} />
      Got it
    </motion.span>
  );
}
