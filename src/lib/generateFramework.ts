import type { Answers } from "./types";

export async function generateFramework(feature: string, answers: Answers): Promise<string> {
  const asymLabel = answers.costAsymmetry === "fp" ? "False Positive" : "False Negative";
  const stakes = answers.stakesLevel ?? "medium";
  const hitlList = answers.hitl.length > 0 ? answers.hitl : ["No explicit human review defined"];

  const prompt = `You are a senior AI product manager writing an evaluation framework for a new AI feature. Be specific and concrete — no generic filler.

FEATURE: ${feature}

CONTEXT FROM THE PM'S ANSWERS:
- Consequence of error: ${answers.errorConsequence || "Not specified"}
- Dominant error to minimize: ${asymLabel}
- Stakes level: ${stakes}
- Human-in-the-loop requirements: ${hitlList.join(", ")}

Write a structured evaluation framework with these exact sections:
1. FEATURE SUMMARY (one sentence)
2. ERROR TOLERANCE PROFILE (interpret the stakes and consequence into a concrete acceptable error rate)
3. RISK ASYMMETRY VERDICT (explain the tradeoff being made and why, in plain language)
4. HUMAN-IN-THE-LOOP REQUIREMENTS (concrete, actionable)
5. EVALUATION CHECKLIST (5-7 specific checklist items a real team would use before shipping)

Keep it tight and usable — this is a working doc, not an essay.`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
  ?.find((p: { text?: string }) => typeof p.text === "string" && p.text.length > 0)
  ?.text;

  if (!text) {
    throw new Error("Gemini returned no usable content.");
  }

  return text;
}