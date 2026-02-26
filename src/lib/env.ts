type ServerEnv = {
  geminiApiKey: string | undefined;
  nanoBananaApiKey: string | undefined;
  geminiTextModel: string;
  nanoBananaModel: string;
};

export function getServerEnv(): ServerEnv {
  return {
    geminiApiKey: process.env.GEMINI_API_KEY,
    nanoBananaApiKey: process.env.NANO_BANANA_API_KEY,
    geminiTextModel: process.env.GEMINI_TEXT_MODEL ?? "gemini-flash-latest",
    nanoBananaModel:
      process.env.NANO_BANANA_MODEL ??
      process.env.GEMINI_IMAGE_MODEL ??
      "gemini-3.1-flash-image-preview",
  };
}

export function getMissingStoryApiKeys(): string[] {
  const env = getServerEnv();
  const missing: string[] = [];

  if (!env.geminiApiKey && !env.nanoBananaApiKey) {
    missing.push("GEMINI_API_KEY");
  }

  return missing;
}
