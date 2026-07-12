"use client";

import React from "react";
import { motion } from "framer-motion";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Feedback } from "@/lib/types";

type OutputScreenProps = {
  framework: string;
  feedback: Feedback;
  onCopy: () => void;
  onFeedback: (value: Feedback) => void;
  copyStatus: "idle" | "copied";
};

export function OutputScreen({
  framework,
  feedback,
  onCopy,
  onFeedback,
  copyStatus,
}: OutputScreenProps) {
  return (
    <motion.div
      key="output"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <h2 className="font-display text-[1.55rem] font-semibold text-ink tracking-tight">
          Your evaluation framework
        </h2>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-button text-sm font-label font-medium bg-primary text-background transition-all duration-200 hover:bg-[#5C4F8A] hover:shadow-[0_4px_16px_rgba(75,63,114,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Copy size={14} strokeWidth={1.75} />
          {copyStatus === "copied" ? "Copied!" : "Copy framework"}
        </button>
      </div>

      <div className="rounded-card p-4 sm:p-6 md:p-8 bg-ink shadow-framework-doc">
      <div className="prose prose-invert prose-sm max-w-none
  prose-headings:font-display prose-headings:text-card prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-3
  prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
  prose-p:text-card prose-p:leading-relaxed prose-p:font-body prose-p:my-2
  prose-li:text-card prose-li:font-body prose-li:leading-relaxed prose-li:my-1
  prose-strong:text-white prose-strong:font-semibold
  prose-code:text-card prose-code:bg-white/10 prose-code:px-1 prose-code:rounded prose-code:text-xs
  prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:text-card prose-pre:text-xs prose-pre:leading-relaxed prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap
  prose-hr:border-white/20
  [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_table]:text-card
  [&_thead]:border-b [&_thead]:border-white/20
  [&_th]:text-white [&_th]:font-semibold [&_th]:py-2 [&_th]:px-3 [&_th]:text-left [&_th]:whitespace-normal [&_th]:break-words [&_th]:align-top
  [&_td]:py-2 [&_td]:px-3 [&_td]:border-t [&_td]:border-white/10 [&_td]:whitespace-normal [&_td]:break-words [&_td]:align-top [&_td]:text-card
  [&_tr]:border-b [&_tr]:border-white/5
  [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
  <ReactMarkdown
    components={{
      table: ({ children }) => (
        <div className="w-full overflow-x-auto my-4 rounded-lg">
          <table className="border-collapse text-xs" style={{ width: "100%", minWidth: "100%" }}>
            {children}
          </table>
        </div>
      ),
      th: ({ children }) => (
        <th className="text-white font-semibold py-2 px-3 text-left border-b border-white/20 align-top"
          style={{ whiteSpace: "normal", wordBreak: "break-word", minWidth: "80px" }}>
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="text-card py-2 px-3 border-t border-white/10 align-top"
          style={{ whiteSpace: "normal", wordBreak: "break-word", minWidth: "80px" }}>
          {children}
        </td>
      ),
      li: ({ children }) => {
        const extractText = (node: React.ReactNode): string => {
          if (typeof node === "string") return node;
          if (typeof node === "number") return String(node);
          if (Array.isArray(node)) return node.map(extractText).join("");
          if (node && typeof node === "object" && "props" in node) {
            const element = node as React.ReactElement<{ children?: React.ReactNode }>;
            return extractText(element.props.children);
          }
          return "";
        };

        const rawText = extractText(children);
        const isUnchecked = rawText.trimStart().startsWith("[ ]");
        const isChecked = rawText.trimStart().startsWith("[x]") || rawText.trimStart().startsWith("[X]");

        if (isUnchecked || isChecked) {
          const stripPrefix = (node: React.ReactNode): React.ReactNode => {
            if (typeof node === "string") {
              return node.replace(/^\s*\[[ xX]\]\s*/, "");
            }
            if (Array.isArray(node)) {
              const [first, ...rest] = node;
              return [stripPrefix(first), ...rest];
            }
            if (node && typeof node === "object" && "props" in node) {
              const el = node as React.ReactElement<{ children?: React.ReactNode }>;
              return React.cloneElement(el, {
                ...el.props,
                children: stripPrefix(el.props.children)
              });
            }
            return node;
          };

          return (
            <li className="flex items-start gap-2 list-none !pl-0">
              <span className={`mt-1 w-4 h-4 flex-shrink-0 rounded border ${
                isChecked ? "bg-accent border-accent" : "border-white/30 bg-white/5"
              }`} />
              <span className="flex-1">{stripPrefix(children)}</span>
            </li>
          );
        }

        return <li className="ml-4">{children}</li>;
      },
    }}
  >
    {framework}
  </ReactMarkdown>
</div>
      </div>

      <div className="flex flex-wrap items-center gap-4 px-4 sm:px-6 py-4 rounded-2xl bg-card">
        <p className="text-sm font-body text-primary leading-relaxed flex-1">
          Would you use this as written?
        </p>
        <div className="flex gap-2">
          {(["yes", "no"] as const).map((fb) => (
            <button
              key={fb}
              type="button"
              onClick={() => onFeedback(fb)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-button text-xs font-label font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border-[1.5px] ${
                feedback === fb
                  ? fb === "yes"
                    ? "bg-success border-primary scale-[1.03]"
                    : "bg-input-bg border-primary scale-[1.03]"
                  : "bg-background border-primary/15 scale-100"
              }`}
            >
              {fb === "yes" ? (
                <ThumbsUp size={12} strokeWidth={1.75} />
              ) : (
                <ThumbsDown size={12} strokeWidth={1.75} />
              )}
              {fb === "yes" ? "Yes" : "Needs work"}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <motion.p
          key={feedback}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-body text-muted"
        >
          {feedback === "yes"
            ? "Great — take it into your next sprint."
            : "Fair enough. Refine your answers and regenerate."}
        </motion.p>
      )}
    </motion.div>
  );
}