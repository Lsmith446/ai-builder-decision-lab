"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { GhostButton } from "@/components/GhostButton";
import { RiskOrb } from "@/components/RiskOrb";
import { InputScreen } from "@/components/screens/InputScreen";
import { LoadingScreen } from "@/components/screens/LoadingScreen";
import { OutputScreen } from "@/components/screens/OutputScreen";
import { QuestionsScreen } from "@/components/screens/QuestionsScreen";
import { generateFramework } from "@/lib/generateFramework";
import type { Answers, AppPhase, Feedback, OrbState } from "@/lib/types";

const INITIAL_ANSWERS: Answers = {
  errorConsequence: "",
  costAsymmetry: null,
  hitl: [],
  stakesLevel: null,
};

const LOADING_DURATION_MS = 2000;

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("input");
  const [feature, setFeature] = useState("");
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [revealedQ, setRevealedQ] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const riskBias =
    answers.costAsymmetry === "fp" ? -1 : answers.costAsymmetry === "fn" ? 1 : 0;

  const orbState: OrbState =
    phase === "loading"
      ? "loading"
      : phase === "output"
        ? "settled"
        : phase === "questions" && answers.costAsymmetry !== null
          ? "active"
          : "dormant";

  const asymmetryLabel =
    answers.costAsymmetry === "fp"
      ? "False Positive"
      : answers.costAsymmetry === "fn"
        ? "False Negative"
        : null;

  const framework = useMemo(
    () => (phase === "output" ? generateFramework(feature, answers) : ""),
    [phase, feature, answers],
  );

  const canAdvanceQ = useCallback(
    (q: number) => {
      if (q === 0) return answers.errorConsequence.trim().length > 0;
      if (q === 1) return answers.costAsymmetry !== null;
      if (q === 2) return answers.hitl.length > 0;
      if (q === 3) return answers.stakesLevel !== null;
      return false;
    },
    [answers],
  );

  const handleNext = () => {
    if (revealedQ < 3) {
      setRevealedQ((q) => q + 1);
      return;
    }

    setPhase("loading");
    window.setTimeout(() => setPhase("output"), LOADING_DURATION_MS);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(framework);
    setCopyStatus("copied");
    window.setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const handleReset = () => {
    setPhase("input");
    setFeature("");
    setAnswers(INITIAL_ANSWERS);
    setRevealedQ(0);
    setFeedback(null);
    setCopyStatus("idle");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background">
      <header className="w-full max-w-2xl px-4 sm:px-6 pt-10 pb-2 flex items-center justify-between">
        <span className="font-label text-[13px] font-medium tracking-[0.05em] text-primary uppercase">
          AI Builder Decision Lab
        </span>
        {phase !== "input" && (
          <GhostButton onClick={handleReset}>
            <RotateCcw size={13} strokeWidth={1.75} />
            Start over
          </GhostButton>
        )}
      </header>

      <main className="w-full max-w-2xl px-4 sm:px-6 pb-24 flex flex-col items-center gap-6 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }}
          className="mt-4 sm:mt-8"
        >
          <RiskOrb bias={riskBias} state={orbState} asymmetryLabel={asymmetryLabel} />
        </motion.div>

        {phase === "input" && (
          <InputScreen
            feature={feature}
            onFeatureChange={setFeature}
            onContinue={() => setPhase("questions")}
          />
        )}

        {phase === "questions" && (
          <QuestionsScreen
            answers={answers}
            revealedQ={revealedQ}
            onAnswersChange={setAnswers}
            onNext={handleNext}
            canAdvanceQ={canAdvanceQ}
          />
        )}

        {phase === "loading" && <LoadingScreen />}

        {phase === "output" && (
          <OutputScreen
            framework={framework}
            feedback={feedback}
            onCopy={handleCopy}
            onFeedback={setFeedback}
            copyStatus={copyStatus}
          />
        )}
      </main>

      <footer className="w-full max-w-2xl px-4 sm:px-6 pb-10 flex justify-center">
        <p className="font-label text-[11px] text-footer-text tracking-wide">
          Built for PMs who think carefully about AI risk
        </p>
      </footer>
    </div>
  );
}
