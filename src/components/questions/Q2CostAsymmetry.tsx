"use client";

import type { CostAsymmetry } from "@/lib/types";

type Q2Props = {
  value: CostAsymmetry | null;
  onChange: (value: CostAsymmetry) => void;
};

const OPTIONS = [
  {
    id: "fp" as const,
    label: "False positive",
    sub: "Acting when we shouldn't — flagging the safe thing, interrupting the right action.",
    tag: "Over-cautious",
  },
  {
    id: "fn" as const,
    label: "False negative",
    sub: "Missing when we should catch — letting the bad thing through, failing to act.",
    tag: "Under-cautious",
  },
];

export function Q2CostAsymmetry({ value, onChange }: Q2Props) {
  return (
    <div className="space-y-3">
      <p className="font-label text-[15px] font-medium text-ink">
        Which error is worse for this feature?
      </p>
      <p className="text-sm font-body text-muted leading-relaxed">
        This is your risk asymmetry — it shapes the entire evaluation strategy.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`text-left rounded-button px-5 py-4 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border-[1.5px] ${
                selected
                  ? "bg-primary border-primary shadow-[0px_6px_20px_rgba(75,63,114,0.24)] scale-[1.015]"
                  : "bg-background border-primary/15 scale-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <p
                  className={`font-label font-medium text-sm ${selected ? "text-background" : "text-ink"}`}
                >
                  {opt.label}
                </p>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-label font-medium tracking-wide ${
                    selected
                      ? "bg-background/15 text-background/70"
                      : "bg-primary/8 text-muted"
                  }`}
                >
                  {opt.tag}
                </span>
              </div>
              <p
                className={`text-xs font-body leading-relaxed ${selected ? "text-background/72" : "text-muted"}`}
              >
                {opt.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
