export const AGE_GROUPS = ["3-5", "6-8", "9-12"] as const;

export const STORY_STYLE_OPTIONS = [
  { id: "space-adventure", label: "Space Adventure" },
  { id: "fairy-tale", label: "Fairy Tale" },
  { id: "jungle-quest", label: "Jungle Quest" },
  { id: "underwater-mission", label: "Underwater Mission" },
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];
export type StoryStyleId = (typeof STORY_STYLE_OPTIONS)[number]["id"];

export type UploadedChildPhoto = {
  base64Data: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  fileName?: string;
};

export type StoryCreatorFormValues = {
  ageGroup: AgeGroup;
  favoriteCharacter: string;
  storyStyle: StoryStyleId;
  childPhoto: UploadedChildPhoto;
};

export type StoryGenerationRequest = StoryCreatorFormValues;

export type StoryGenerationMetadata = {
  ageGroup: AgeGroup;
  storyStyle: StoryStyleId;
  favoriteCharacter: string;
};

export type StoryGenerationResponse = {
  title: string;
  storyText: string;
  imageUrl?: string;
  imageBase64?: string;
  metadata: StoryGenerationMetadata;
};

