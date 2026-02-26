import { NextResponse } from "next/server";
import { getMissingStoryApiKeys, getServerEnv } from "@/lib/env";
import { validateStoryGenerationRequest } from "@/lib/story-schema";
import { generateStoryWithProviders } from "@/lib/story-service";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = validateStoryGenerationRequest(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const env = getServerEnv();
  const missingKeys = getMissingStoryApiKeys();

  if (missingKeys.length > 0) {
    return NextResponse.json(
      {
        error:
          "Missing API keys. Add the required variables in .env.local before enabling live generation.",
        missingKeys,
      },
      { status: 501 },
    );
  }

  try {
    const result = await generateStoryWithProviders(parsed.data, {
      geminiApiKey: env.geminiApiKey,
      nanoBananaApiKey: env.nanoBananaApiKey,
      geminiTextModel: env.geminiTextModel,
      nanoBananaModel: env.nanoBananaModel,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Story generation scaffold error", error);
    const message =
      error instanceof Error
        ? error.message
        : "Story generation failed. Please try again.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
