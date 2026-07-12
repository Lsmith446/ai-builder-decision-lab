"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  showChevron?: boolean;
};

export function PrimaryButton({
  onClick,
  disabled = false,
  children,
  showChevron = true,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex items-center gap-2 px-7 py-3.5 rounded-button text-sm font-medium font-label transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:scale-[1.02] enabled:active:scale-[0.98] enabled:hover:shadow-accent-button-hover enabled:shadow-accent-button disabled:bg-accent/35 disabled:text-background/60 disabled:shadow-none enabled:bg-accent enabled:text-background"
    >
      {children}
      {showChevron && !disabled && (
        <ChevronRight
          size={14}
          strokeWidth={1.75}
          className="transition-transform duration-150 group-hover:translate-x-0.5"
        />
      )}
    </button>
  );
}
