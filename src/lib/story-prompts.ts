import type { AgeGroup, StoryGenerationRequest, StoryStyleId } from "@/types/story";

const AGE_GROUP_GUIDANCE: Record<AgeGroup, string> = {
  "3-5":
    "Use short sentences, simple words, gentle pacing, and a warm reassuring tone.",
  "6-8":
    "Use playful language, clear action, and a few descriptive details with easy reading level.",
  "9-12":
    "Use richer vocabulary, stronger plot progression, and imaginative details while staying kid-safe.",
};

const STYLE_GUIDANCE: Record<StoryStyleId, string> = {
  "space-adventure": "Set the story in a colorful space adventure with wonder and teamwork.",
  "fairy-tale": "Write as a modern fairy tale with kindness, magic, and a happy ending.",
  "jungle-quest": "Set the story in a lively jungle quest with animal friends and discovery.",
  "underwater-mission":
    "Set the story in an underwater mission with friendly sea creatures and bright scenery.",
};

export function buildGeminiStoryPrompt(input: StoryGenerationRequest): string {
  const ageGuidance = AGE_GROUP_GUIDANCE[input.ageGroup];
  const styleGuidance = STYLE_GUIDANCE[input.storyStyle];

  return [
    "Write a personalized children's story.",
    "Requirements:",
    `- Age group: ${input.ageGroup}`,
    `- Favorite character: ${input.favoriteCharacter}`,
    `- Story style: ${input.storyStyle}`,
    `- ${ageGuidance}`,
    `- ${styleGuidance}`,
    "- Keep the story kid-safe, positive, non-scary, and encouraging.",
    "- Include a clear beginning, middle, and end.",
    "- Return a short title and the story text.",
  ].join("\n");
}

export function buildNanoBananaImagePrompt(input: StoryGenerationRequest): string {
  return [
    "Create a bright, playful children's book illustration.",
    `Theme: ${input.storyStyle}`,
    `Feature the child's favorite character: ${input.favoriteCharacter}.`,
    "Use a friendly, colorful, non-scary style with soft shapes and clear facial expressions.",
    "Use the provided child photo only as reference for likeness and keep the image age-appropriate.",
  ].join(" ");
}

