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

    const prompt = `You are an expert AI Product Strategy consultant. Turn this AI feature idea into a structured evaluation framework. Be specific and concrete — no generic filler.

FEATURE: ${feature}

CONTEXT:
- Consequence of error: ${answers.errorConsequence || "Not specified"}
- Dominant error to minimize: ${asymLabel}
- Stakes level: ${stakes}
- Human-in-the-loop requirements: ${hitlList.join(", ")}

Generate a structured evaluation framework with these sections:
1. EXECUTIVE RISK VERDICT (2-3 sentences, plain language)
2. ERROR TOLERANCE ANALYSIS (acceptable vs unacceptable failure patterns, with concrete thresholds)
3. RISK ASYMMETRY PLAYBOOK (tactical actions for handling ${asymLabel}s specifically)
4. HUMAN-IN-THE-LOOP GUARDRAILS (exactly where, why, and how a human reviews this system)
5. EVALUATION CHECKLIST (5-7 specific items a real team would verify before shipping)

Tone: Confident, insightful, practical. Make it feel like a polished artifact a PM would hand to an engineering lead.`;

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