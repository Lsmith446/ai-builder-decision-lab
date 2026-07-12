import { NextResponse } from "next/server";
import type { Answers } from "@/lib/types";

type GenerateRequest = {
  feature: string;
  answers: Answers;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.feature?.trim()) {
      return NextResponse.json({ error: "Feature description is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured on server." }, { status: 500 });
    }

    const { feature, answers } = body;

    const asymLabel = answers.costAsymmetry === "fp" ? "False Positive" : "False Negative";
    const stakes = answers.stakesLevel ?? "medium";
    const hitlList = answers.hitl.length > 0 ? answers.hitl : ["No explicit human review defined"];

    const prompt = `You are an expert AI Product Strategy consultant. Turn this AI feature idea into a structured evaluation framework. Be specific and concrete — no generic filler. Every section must feel like a polished, exportable artifact a PM would hand to an engineering lead.

CRITICAL FORMATTING RULES — follow exactly:
- Use clean Markdown: headers with ##, bold with **, bullet points with -
- ASCII diagrams use only: |, -, >, v, +, spaces
- Never use LaTeX notation like $\\ge$ or $\\le$ — write >= or <= instead
- Never use Markdown tables anywhere in your response
- For lists of metrics, components, or roles: use the definition list format shown below

FEATURE: ${feature}

CONTEXT:
- Consequence of error: ${answers.errorConsequence || "Not specified"}
- Dominant error to minimize: ${asymLabel}
- Stakes level: ${stakes}
- Human-in-the-loop requirements: ${hitlList.join(", ")}

Generate a structured evaluation framework with these exact sections in order:

## 1. EXECUTIVE RISK VERDICT
2-3 sentences. Plain language verdict on the risk profile of this feature and the single most important design constraint that follows from it.

---

## 2. ERROR TOLERANCE ANALYSIS
Define acceptable vs. unacceptable failure patterns with concrete thresholds. Include a simple ASCII flow diagram showing where errors enter and get caught.

Then list quantitative thresholds using this exact format — one per line, no tables:

1. **[Metric Name]** — Target: [value]. Measured by: [method].
2. **[Metric Name]** — Target: [value]. Measured by: [method].

---

## 3. RISK ASYMMETRY PLAYBOOK
Tactical actions specifically targeting ${asymLabel} suppression. Include 3-4 named tactics with implementation detail. Include a simple ASCII diagram showing the decision flow.

---

## 4. HUMAN-IN-THE-LOOP GUARDRAILS
Where, why, and how a human reviews this system. Include a simple ASCII diagram of the review flow. 3-4 named guardrails with concrete implementation detail.

---

## 5. EVALUATION CHECKLIST
6-7 specific pre-ship verification items using this exact format:

- [ ] **[Name]** — [description]. Pass criteria: [specific measurable condition].

---

## 6. FEASIBILITY ASSESSMENT
For each major component, use this exact format — no tables:

**[Component Name]**
- Complexity: Simple / Medium / Complex
- Effort: [t-shirt size — days, weeks, or sprints]
- Key Risk: [single biggest unknown or dependency]
- Recommended Approach: [custom build / Python script / Apps Script + Sheets / AI agent / third-party API / off-the-shelf SaaS — pick the lowest-complexity path that meets the requirement]

Repeat for each component. Then end with:

**Overall Feasibility Verdict:** [2 sentences on total build complexity and biggest risk to watch].

---

## 7. TEAM & ASSETS NEEDED
For each workstream, use this exact format — no tables:

**[Workstream Name]**
- Role: [specific role — not just "Engineer" but what kind]
- Responsibility: [what they own]
- Phase: [when in the build sequence]

Repeat for each workstream. Then add:

**External Assets & Resources Needed:**
- [List any SMEs, vendors, APIs, datasets, or special access required]

**Squad Summary:** [One line — total team size and recommended composition].`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Gemini API call failed." },
        { status: response.status }
      );
    }

    const frameworkText = data.candidates?.[0]?.content?.parts
      ?.find((p: { text?: string }) => typeof p.text === "string" && p.text.length > 0)
      ?.text;

    if (!frameworkText) {
      console.error("Unexpected Gemini response shape:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Gemini returned no usable content." },
        { status: 500 }
      );
    }

    return NextResponse.json({ framework: frameworkText });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Route error:", message);
    return NextResponse.json(
      { error: message || "Failed to generate framework." },
      { status: 500 }
    );
  }
}