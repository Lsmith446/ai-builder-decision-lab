"use client";

import { useState } from "react";
import { FilledCheck } from "@/components/FilledCheck";

type Q1Props = {
  value: string;
  onChange: (value: string) => void;
};

export function Q1ErrorConsequence({ value, onChange }: Q1Props) {
  const [focused, setFocused] = useState(false);
  const filled = !focused && value.trim().length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-label text-[15px] font-medium text-ink">
          What happens when the AI gets it wrong?
        </p>
        {filled && <FilledCheck />}
      </div>
      <p className="text-sm font-body text-muted leading-relaxed">
        Describe the real-world consequence — who is affected, what must be undone.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="e.g. A legitimate transaction is blocked, frustrating the customer and generating a chargeback dispute."
        rows={3}
        className={`w-full rounded-button px-4 py-3 text-sm font-body resize-none bg-background text-ink leading-relaxed transition-[border-color,box-shadow] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 border-[1.5px] ${
          focused
            ? "border-primary shadow-[0_0_0_3px_rgba(75,63,114,0.14)]"
            : filled
              ? "border-success"
              : "border-primary/15"
        }`}
      />
    </div>
  );
}
