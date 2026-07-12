"use client";

import { motion } from "framer-motion";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Feedback } from "@/lib/types";

type OutputScreenProps = {
  framework: string;
  feedback: Feedback;
  onCopy: () => void;
  onFeedback: (value: Feedback) => void;
  copyStatus: "idle" | "copied";
};

export function OutputScreen({
  framework,
  feedback,
  onCopy,
  onFeedback,
  copyStatus,
}: OutputScreenProps) {
  return (
    <motion.div
      key="output"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <h2 className="font-display text-[1.55rem] font-semibold text-ink tracking-tight">
          Your evaluation framework
        </h2>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-button text-sm font-label font-medium bg-primary text-background transition-all duration-200 hover:bg-[#5C4F8A] hover:shadow-[0_4px_16px_rgba(75,63,114,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Copy size={14} strokeWidth={1.75} />
          {copyStatus === "copied" ? "Copied!" : "Copy framework"}
        </button>
      </div>

      <div className="rounded-card p-4 sm:p-6 md:p-8 bg-ink shadow-framework-doc">
        <pre className="font-label text-[13px] leading-relaxed whitespace-pre-wrap break-words text-card">
          {framework}
        </pre>
      </div>

      <div className="flex flex-wrap items-center gap-4 px-4 sm:px-6 py-4 rounded-2xl bg-card">
        <p className="text-sm font-body text-primary leading-relaxed flex-1">
          Would you use this as written?
        </p>
        <div className="flex gap-2">
          {(["yes", "no"] as const).map((fb) => (
            <button
              key={fb}
              type="button"
              onClick={() => onFeedback(fb)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-button text-xs font-label font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border-[1.5px] ${
                feedback === fb
                  ? fb === "yes"
                    ? "bg-success border-primary scale-[1.03]"
                    : "bg-input-bg border-primary scale-[1.03]"
                  : "bg-background border-primary/15 scale-100"
              }`}
            >
              {fb === "yes" ? (
                <ThumbsUp size={12} strokeWidth={1.75} />
              ) : (
                <ThumbsDown size={12} strokeWidth={1.75} />
              )}
              {fb === "yes" ? "Yes" : "Needs work"}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <motion.p
          key={feedback}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-body text-muted"
        >
          {feedback === "yes"
            ? "Great — take it into your next sprint."
            : "Fair enough. Refine your answers and regenerate."}
        </motion.p>
      )}
    </motion.div>
  );
}
