import type { Answers } from "./types";

/**
 * Placeholder framework generator — swap this for a Gemini API call later.
 * The API route at `src/app/api/generate/route.ts` can call Google AI Studio
 * and return structured framework text from the user's inputs.
 */
export function generateFramework(feature: string, answers: Answers): string {
  const asymLabel = answers.costAsymmetry === "fp" ? "False Positive" : "False Negative";
  const asymOpp = answers.costAsymmetry === "fp" ? "false negatives" : "false positives";
  const hitlList =
    answers.hitl.length > 0 ? answers.hitl : ["No explicit human review defined"];
  const stakes = answers.stakesLevel ?? "medium";
  const errorRate = { low: "< 15%", medium: "< 5%", high: "< 1%", critical: "< 0.1%" }[stakes];
  const threshold =
    answers.costAsymmetry === "fp"
      ? "High (≥ 0.85) before triggering action"
      : "Lower (≥ 0.65) acceptable — missing cases is the greater harm";
  const reeval = new Date(Date.now() + 90 * 86400000).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hitlNote =
    answers.hitl.length > 0 && answers.hitl[0] !== "No human review needed"
      ? "  ☐ Build or spec the queue UI for human reviewers\n"
      : "";
  const redTeam =
    stakes === "critical" || stakes === "high"
      ? "  ☐ Red-team test for adversarial and edge-case inputs\n"
      : "";

  return `AI FEATURE EVALUATION FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEATURE SUMMARY
${feature}

ERROR TOLERANCE PROFILE
Consequence of error:  ${answers.errorConsequence || "Not specified"}
Acceptable error rate: ${errorRate}
Stakes level:          ${stakes.toUpperCase()}

RISK ASYMMETRY VERDICT
Dominant error to minimize: ${asymLabel}
Strategy: Bias the model to reduce ${asymLabel.toLowerCase()}s.
Accept more ${asymOpp} as the explicit cost of this asymmetry.
Confidence threshold: ${threshold}

HUMAN-IN-THE-LOOP REQUIREMENTS
${hitlList.map((h) => `  · ${h}`).join("\n")}

EVALUATION CHECKLIST
${redTeam}  ☐ Establish baseline metrics before deployment
  ☐ Track ${asymLabel.toLowerCase()} rate separately from overall accuracy
  ☐ Define a rollback threshold — what rate triggers an incident?
  ☐ Document who reviews flagged cases and within what SLA
  ☐ Schedule re-evaluation: ${reeval}
${hitlNote}  ☐ Log model confidence scores on every decision

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated ${today} · AI Builder Decision Lab`;
}
