"use client";

import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-card p-4 sm:p-6 md:p-8 bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-px ${className}`}
    >
      {children}
    </div>
  );
}
