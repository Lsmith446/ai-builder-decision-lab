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
      return NextResponse.json({ error: "API key setup missing on server." }, { status: 500 });
    }

    // Build the expert prompt matching your design system's tone
    const systemPrompt = `
      You are an expert AI Product Strategy consultant. Your goal is to turn a rough AI feature idea into a structured evaluation framework.
      
      User's AI Feature Idea: "${body.feature}"
      
      Context from their choices:
      - Primary Error Consequence: ${body.answers.q1 || 'Not specified'}
      - Cost Asymmetry Stance: ${body.answers.q2 || 'Not specified'}
      - Human-In-The-Loop Placement: ${body.answers.q3 || 'Not specified'}
      - Risk/Stakes Level: ${body.answers.q4 || 'Not specified'}

      Generate a highly professional, structured evaluation framework formatted cleanly in Markdown. 
      Use clear headings, bullet points, and data sections. Provide:
      1. Executive Risk Verdict (A concise evaluation matching the tone of Approachable Rigor).
      2. Error Tolerance Analysis (Breakdown of acceptable vs. unacceptable failure patterns).
      3. Risk Asymmetry Playbook (Clear tactical actions handling False Positives vs. False Negatives based on their answers).
      4. Human-In-The-Loop Operational Guardrails (Exactly where, why, and how a human reviews the system artifact).
      
      Tone: Confident, insightful, and practical. Do not use generic filler. Make it feel like a polished, exportable artifact a PM would hand to an engineering lead.
    `;

    // Direct HTTP fetch to the free Google AI Studio endpoint
    const response = await fetch(
      `https://googleapis.com{apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Gemini processing failed" },
        { status: response.status }
      );
    }

    // Safely pull the generated markdown text string out of Gemini's nested response payload
    const frameworkText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to parse framework.";

    // Return the response matching your frontend's layout expectations perfectly
    return NextResponse.json({ framework: frameworkText });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate framework." },
      { status: 500 }
    );
  }
}

