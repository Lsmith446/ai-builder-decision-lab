"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";

type InputScreenProps = {
  feature: string;
  onFeatureChange: (value: string) => void;
  onContinue: () => void;
};

export function InputScreen({ feature, onFeatureChange, onContinue }: InputScreenProps) {
  const wordCount = feature.trim() ? feature.trim().split(/\s+/).length : 0;

  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      <div className="text-center space-y-3">
        <h1 className="font-display text-[clamp(1.85rem,5vw,2.65rem)] font-semibold text-ink tracking-tight leading-[1.18]">
          Describe the AI feature
          <br />
          <span className="text-primary">you&apos;re building</span>
        </h1>
        <p className="text-muted font-body text-[15px] leading-relaxed max-w-[380px] mx-auto">
          One sentence is enough. The questions that follow shape the framework.
        </p>
      </div>

      <Card>
        <textarea
          value={feature}
          onChange={(e) => onFeatureChange(e.target.value)}
          placeholder="e.g. 'AI flags potentially fraudulent transactions for review'"
          rows={4}
          className="w-full rounded-button px-4 py-3 text-base font-body resize-none bg-background text-ink leading-relaxed transition-[border-color,box-shadow] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 border-[1.5px] border-primary/15 focus:border-primary focus:shadow-[0_0_0_3px_rgba(75,63,114,0.13)]"
        />
        <div className="mt-5 flex items-center justify-between">
          <span
            className={`font-label text-xs transition-colors duration-200 ${
              feature.trim().length > 0 ? "text-success-text" : "text-muted-light"
            }`}
          >
            {feature.trim().length > 0
              ? `${wordCount} word${wordCount !== 1 ? "s" : ""}`
              : "Start typing above"}
          </span>
          <PrimaryButton onClick={onContinue} disabled={feature.trim().length < 8}>
            Continue
          </PrimaryButton>
        </div>
      </Card>
    </motion.div>
  );
}
