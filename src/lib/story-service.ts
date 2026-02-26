import { buildGeminiStoryPrompt, buildNanoBananaImagePrompt } from "@/lib/story-prompts";
import type { StoryGenerationRequest, StoryGenerationResponse } from "@/types/story";

type StoryProviderInputs = {
  geminiApiKey?: string;
  nanoBananaApiKey?: string;
  geminiTextModel?: string;
  nanoBananaModel?: string;
};

type GeminiPart = {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
  inline_data?: { mime_type?: string; data?: string };
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
    finishReason?: string;
    finish_reason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
    block_reason?: string;
  };
  prompt_feedback?: {
    block_reason?: string;
  };
};

type StoryJsonPayload = {
  title: string;
  storyText: string;
};

const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const DEFAULT_TEXT_MODEL = "gemini-flash-latest";
const DEFAULT_IMAGE_MODEL = "gemini-3.1-flash-image-preview";

const STORY_SYSTEM_INSTRUCTION =
  "You write delightful, kid-safe stories. Stay positive, non-scary, and encouraging. Avoid unsafe content and keep the story appropriate for children.";

const STORY_RESPONSE_JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: {
      type: "STRING",
      description: "A short, playful story title for children.",
    },
    storyText: {
      type: "STRING",
      description:
        "The full story in readable paragraphs. Keep it kid-safe, positive, and age-appropriate.",
    },
  },
  required: ["title", "storyText"],
  propertyOrdering: ["title", "storyText"],
} as const;

function getResolvedApiKey(keys: StoryProviderInputs) {
  return keys.geminiApiKey ?? keys.nanoBananaApiKey;
}

function getResolvedImageApiKey(keys: StoryProviderInputs) {
  return keys.nanoBananaApiKey ?? keys.geminiApiKey;
}

async function geminiGenerateContent(
  model: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<GeminiGenerateContentResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(
      `${GEMINI_API_BASE_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );

    const rawText = await response.text();
    const parsed = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {};

    if (!response.ok) {
      const message =
        typeof (parsed.error as { message?: unknown } | undefined)?.message === "string"
          ? ((parsed.error as { message: string }).message)
          : `Gemini API request failed with status ${response.status}.`;
      throw new Error(message);
    }

    return parsed as GeminiGenerateContentResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Gemini API request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getCandidateParts(response: GeminiGenerateContentResponse): GeminiPart[] {
  const firstCandidate = response.candidates?.[0];
  return firstCandidate?.content?.parts ?? [];
}

function getPromptBlockReason(response: GeminiGenerateContentResponse) {
  return (
    response.promptFeedback?.blockReason ??
    response.promptFeedback?.block_reason ??
    response.prompt_feedback?.block_reason
  );
}

function tryParseJsonText(text: string): StoryJsonPayload | null {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(withoutFence) as Partial<StoryJsonPayload>;
    if (
      typeof parsed.title === "string" &&
      parsed.title.trim() &&
      typeof parsed.storyText === "string" &&
      parsed.storyText.trim()
    ) {
      return {
        title: parsed.title.trim(),
        storyText: parsed.storyText.trim(),
      };
    }
  } catch {
    // Fall through to null.
  }

  return null;
}

function extractStructuredStory(
  response: GeminiGenerateContentResponse,
): StoryJsonPayload {
  const blockReason = getPromptBlockReason(response);
  if (blockReason) {
    throw new Error(`Story prompt was blocked by Gemini (${blockReason}).`);
  }

  const parts = getCandidateParts(response);
  const textParts = parts.map((part) => part.text).filter((value): value is string => typeof value === "string");

  for (const text of textParts) {
    const parsed = tryParseJsonText(text);
    if (parsed) {
      return parsed;
    }
  }

  throw new Error("Gemini returned an unexpected story format.");
}

function extractGeneratedImage(
  response: GeminiGenerateContentResponse,
): { mimeType: string; base64Data: string } {
  const blockReason = getPromptBlockReason(response);
  if (blockReason) {
    throw new Error(`Image prompt was blocked by Gemini (${blockReason}).`);
  }

  const parts = getCandidateParts(response);

  for (const part of parts) {
    const inlineData = part.inlineData;
    if (
      inlineData &&
      typeof inlineData.mimeType === "string" &&
      typeof inlineData.data === "string" &&
      inlineData.data.length > 0
    ) {
      return { mimeType: inlineData.mimeType, base64Data: inlineData.data };
    }

    const inlineDataSnake = part.inline_data;
    if (
      inlineDataSnake &&
      typeof inlineDataSnake.mime_type === "string" &&
      typeof inlineDataSnake.data === "string" &&
      inlineDataSnake.data.length > 0
    ) {
      return { mimeType: inlineDataSnake.mime_type, base64Data: inlineDataSnake.data };
    }
  }

  throw new Error("Gemini image generation did not return an image.");
}

async function generateStoryText(
  request: StoryGenerationRequest,
  apiKey: string,
  model: string,
): Promise<StoryJsonPayload> {
  const storyPrompt = buildGeminiStoryPrompt(request);

  const response = await geminiGenerateContent(model, apiKey, {
    systemInstruction: {
      parts: [{ text: STORY_SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: storyPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      responseMimeType: "application/json",
      responseJsonSchema: STORY_RESPONSE_JSON_SCHEMA,
    },
  });

  return extractStructuredStory(response);
}

async function generateStoryImage(
  request: StoryGenerationRequest,
  apiKey: string,
  model: string,
): Promise<{ mimeType: string; base64Data: string }> {
  const imagePrompt = buildNanoBananaImagePrompt(request);

  const response = await geminiGenerateContent(model, apiKey, {
    contents: [
      {
        role: "user",
        parts: [
          { text: imagePrompt },
          {
            inlineData: {
              mimeType: request.childPhoto.mimeType,
              data: request.childPhoto.base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
    },
  });

  return extractGeneratedImage(response);
}

export async function generateStoryWithProviders(
  request: StoryGenerationRequest,
  keys: StoryProviderInputs,
): Promise<StoryGenerationResponse> {
  const textApiKey = getResolvedApiKey(keys);
  const imageApiKey = getResolvedImageApiKey(keys);

  if (!textApiKey) {
    throw new Error("Missing Gemini API key for story generation.");
  }

  if (!imageApiKey) {
    throw new Error("Missing Gemini API key for image generation.");
  }

  const textModel = keys.geminiTextModel ?? DEFAULT_TEXT_MODEL;
  const imageModel = keys.nanoBananaModel ?? DEFAULT_IMAGE_MODEL;

  const story = await generateStoryText(request, textApiKey, textModel);
  const image = await generateStoryImage(request, imageApiKey, imageModel);

  return {
    title: story.title,
    storyText: story.storyText,
    imageUrl: `data:${image.mimeType};base64,${image.base64Data}`,
    metadata: {
      ageGroup: request.ageGroup,
      storyStyle: request.storyStyle,
      favoriteCharacter: request.favoriteCharacter,
    },
  };
}
