"use client";

import { FilledCheck } from "@/components/FilledCheck";

export const HITL_OPTIONS = [
  "Before any action is taken",
  "For high-confidence exceptions only",
  "On random sample for audit",
  "Only on explicit user request",
  "When confidence is below threshold",
  "No human review needed",
] as const;

type Q3Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function Q3HumanInLoop({ value, onChange }: Q3Props) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-label text-[15px] font-medium text-ink">
          Where does a human need to stay involved?
        </p>
        {value.length > 0 && <FilledCheck />}
      </div>
      <p className="text-sm font-body text-muted leading-relaxed">
        Select all that apply — being honest here shapes the HITL requirements.
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {HITL_OPTIONS.map((opt) => {
          const selected = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-4 py-2 rounded-badge text-xs font-label font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border-[1.5px] ${
                selected
                  ? "bg-primary text-background border-primary shadow-[0_2px_8px_rgba(75,63,114,0.18)] scale-[1.03]"
                  : "bg-background text-primary border-primary/20 scale-100"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
