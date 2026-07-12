"use client";

import { motion } from "framer-motion";
import type { OrbState } from "@/lib/types";

type RiskOrbProps = {
  bias: number;
  state: OrbState;
  asymmetryLabel: string | null;
};

const FP_COLOR = "#E84D8A";
const FN_COLOR = "#4B3F72";
const NEUTRAL_A = "#7B6FA0";
const NEUTRAL_B = "#9B8EC4";

const CAPTIONS: Record<OrbState, (label: string | null) => string> = {
  dormant: () => "Waiting for your idea…",
  active: () => "Risk asymmetry detected",
  loading: () => "Settling verdict…",
  settled: (label) => (label ? `Risk: ${label} dominant` : "Verdict ready"),
};

export function RiskOrb({ bias, state, asymmetryLabel }: RiskOrbProps) {
  const colorA = state === "dormant" ? NEUTRAL_A : bias < 0 ? FP_COLOR : FN_COLOR;
  const colorB = state === "dormant" ? NEUTRAL_B : bias < 0 ? FN_COLOR : FP_COLOR;
  const mid = state === "dormant" ? 50 : Math.round(50 + bias * 30);

  const gradient = `radial-gradient(circle at ${mid}% 45%, ${colorA} 0%, ${colorB} 100%)`;
  const pulseClass =
    state === "dormant" ? "orb-pulse-slow" : state === "loading" ? "orb-pulse-fast" : "";

  const shadow =
    state === "loading"
      ? "0 0 56px 14px rgba(232, 77, 138, 0.22), 0 8px 32px rgba(75, 63, 114, 0.16)"
      : state === "settled"
        ? "0 10px 48px rgba(75, 63, 114, 0.28), 0 2px 12px rgba(75, 63, 114, 0.14)"
        : "0 8px 40px rgba(75, 63, 114, 0.18), 0 2px 12px rgba(75, 63, 114, 0.1)";

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative flex items-center justify-center w-28 h-28 sm:w-40 sm:h-40 ${pulseClass}`}
      >
        <div
          className="rounded-full w-full h-full transition-[background,box-shadow] duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ background: gradient, boxShadow: shadow }}
        />
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 33% 28%, rgba(255,255,255,0.22) 0%, transparent 55%)",
          }}
        />
      </div>

      <motion.p
        key={state}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`font-label text-xs font-medium tracking-[0.06em] uppercase ${
          state === "active" || state === "settled" ? "text-primary" : "text-muted-light"
        }`}
      >
        {CAPTIONS[state](asymmetryLabel)}
      </motion.p>
    </div>
  );
}
