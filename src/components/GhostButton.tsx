"use client";

import type { ReactNode } from "react";

type GhostButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

export function GhostButton({ onClick, children }: GhostButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-body text-muted-light transition-all duration-150 hover:bg-input-bg hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
    </button>
  );
}
