import { NextResponse } from "next/server";
import { generateFramework } from "@/lib/generateFramework";
import type { Answers } from "@/lib/types";

type GenerateRequest = {
  feature: string;
  answers: Answers;
};

/**
 * Future Gemini integration point.
 * Replace the generateFramework() call with a Google AI Studio request
 * using process.env.GEMINI_API_KEY once you're ready to connect.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.feature?.trim()) {
      return NextResponse.json({ error: "Feature description is required." }, { status: 400 });
    }

    const framework = generateFramework(body.feature, body.answers);

    return NextResponse.json({ framework });
  } catch {
    return NextResponse.json({ error: "Failed to generate framework." }, { status: 500 });
  }
}
