"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressDots } from "@/components/ProgressDots";
import { Q1ErrorConsequence } from "@/components/questions/Q1ErrorConsequence";
import { Q2CostAsymmetry } from "@/components/questions/Q2CostAsymmetry";
import { Q3HumanInLoop } from "@/components/questions/Q3HumanInLoop";
import { Q4StakesLevel } from "@/components/questions/Q4StakesLevel";
import type { Answers } from "@/lib/types";

type QuestionsScreenProps = {
  answers: Answers;
  revealedQ: number;
  onAnswersChange: (answers: Answers) => void;
  onNext: () => void;
  canAdvanceQ: (q: number) => boolean;
};

export function QuestionsScreen({
  answers,
  revealedQ,
  onAnswersChange,
  onNext,
  canAdvanceQ,
}: QuestionsScreenProps) {
  const setAnswers = (patch: Partial<Answers>) =>
    onAnswersChange({ ...answers, ...patch });

  return (
    <motion.div
      key="questions"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="w-full space-y-4"
    >
      <div className="flex items-center justify-between px-1 pb-1">
        <h2 className="font-display text-[1.45rem] font-semibold text-ink tracking-tight">
          A few quick questions
        </h2>
        <ProgressDots total={4} current={revealedQ} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        <Card>
          <Q1ErrorConsequence
            value={answers.errorConsequence}
            onChange={(errorConsequence) => setAnswers({ errorConsequence })}
          />
          {revealedQ === 0 && (
            <div className="mt-5 flex justify-end">
              <PrimaryButton onClick={onNext} disabled={!canAdvanceQ(0)}>
                Next
              </PrimaryButton>
            </div>
          )}
        </Card>
      </motion.div>

      {revealedQ >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <Card>
            <Q2CostAsymmetry
              value={answers.costAsymmetry}
              onChange={(costAsymmetry) => setAnswers({ costAsymmetry })}
            />
            {revealedQ === 1 && (
              <div className="mt-5 flex justify-end">
                <PrimaryButton onClick={onNext} disabled={!canAdvanceQ(1)}>
                  Next
                </PrimaryButton>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {revealedQ >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <Card>
            <Q3HumanInLoop
              value={answers.hitl}
              onChange={(hitl) => setAnswers({ hitl })}
            />
            {revealedQ === 2 && (
              <div className="mt-5 flex justify-end">
                <PrimaryButton onClick={onNext} disabled={!canAdvanceQ(2)}>
                  Next
                </PrimaryButton>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {revealedQ >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <Card>
            <Q4StakesLevel
              value={answers.stakesLevel}
              onChange={(stakesLevel) => setAnswers({ stakesLevel })}
            />
            <div className="mt-6 flex justify-end">
              <PrimaryButton onClick={onNext} disabled={!canAdvanceQ(3)}>
                Generate framework
              </PrimaryButton>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
