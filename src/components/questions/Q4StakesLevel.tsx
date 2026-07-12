"use client";

import { FilledCheck } from "@/components/FilledCheck";
import type { StakesLevel } from "@/lib/types";

type Q4Props = {
  value: StakesLevel | null;
  onChange: (value: StakesLevel) => void;
};

const STAKES = [
  {
    id: "low" as const,
    label: "Low",
    sub: "Easily reversed, minimal user impact",
    accent: "#B8E3D1",
    textOnSel: "#1F1B2E",
    subOnSel: "rgba(31,27,46,0.55)",
  },
  {
    id: "medium" as const,
    label: "Medium",
    sub: "Some friction, recoverable with effort",
    accent: "#7B6FA0",
    textOnSel: "#F7F5F2",
    subOnSel: "rgba(247,245,242,0.65)",
  },
  {
    id: "high" as const,
    label: "High",
    sub: "Hard to undo, real harm possible",
    accent: "#E84D8A",
    textOnSel: "#F7F5F2",
    subOnSel: "rgba(247,245,242,0.65)",
  },
  {
    id: "critical" as const,
    label: "Critical",
    sub: "Irreversible — safety or legal exposure",
    accent: "#1F1B2E",
    textOnSel: "#F7F5F2",
    subOnSel: "rgba(247,245,242,0.55)",
  },
];

export function Q4StakesLevel({ value, onChange }: Q4Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-label text-[15px] font-medium text-ink">
          What is the blast radius of a bad decision?
        </p>
        {value && <FilledCheck />}
      </div>
      <p className="text-sm font-body text-muted leading-relaxed">
        Worst plausible case — one person, or many?
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {STAKES.map((s) => {
          const selected = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className="text-left rounded-button px-4 py-4 transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border-[1.5px]"
              style={{
                background: selected ? s.accent : "#F7F5F2",
                borderColor: selected ? s.accent : "rgba(75,63,114,0.15)",
                boxShadow: selected ? `0px 4px 16px ${s.accent}50` : "none",
                transform: selected ? "scale(1.02)" : "scale(1)",
              }}
            >
              <p
                className="font-label font-medium text-sm mb-1"
                style={{ color: selected ? s.textOnSel : "#1F1B2E" }}
              >
                {s.label}
              </p>
              <p
                className="text-xs font-body leading-relaxed"
                style={{ color: selected ? s.subOnSel : "#6B5F8A" }}
              >
                {s.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
