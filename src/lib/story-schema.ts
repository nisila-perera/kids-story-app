import {
  AGE_GROUPS,
  STORY_STYLE_OPTIONS,
  type StoryGenerationRequest,
  type UploadedChildPhoto,
} from "@/types/story";

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const ALLOWED_MIME_TYPES = new Set<UploadedChildPhoto["mimeType"]>([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const STORY_STYLE_IDS = new Set(STORY_STYLE_OPTIONS.map((style) => style.id));

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validatePhoto(photo: unknown): ValidationResult<UploadedChildPhoto> {
  if (!isObject(photo)) {
    return { ok: false, error: "Photo payload is required." };
  }

  const base64Data = photo.base64Data;
  const mimeType = photo.mimeType;
  const fileName = photo.fileName;

  if (typeof base64Data !== "string" || base64Data.trim().length < 16) {
    return { ok: false, error: "Photo data is invalid." };
  }

  if (typeof mimeType !== "string" || !ALLOWED_MIME_TYPES.has(mimeType as UploadedChildPhoto["mimeType"])) {
    return { ok: false, error: "Photo type must be JPEG, PNG, or WebP." };
  }

  if (fileName !== undefined && typeof fileName !== "string") {
    return { ok: false, error: "Photo filename is invalid." };
  }

  return {
    ok: true,
    data: {
      base64Data,
      mimeType: mimeType as UploadedChildPhoto["mimeType"],
      fileName,
    },
  };
}

export function validateStoryGenerationRequest(
  input: unknown,
): ValidationResult<StoryGenerationRequest> {
  if (!isObject(input)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const ageGroup = input.ageGroup;
  const favoriteCharacter = input.favoriteCharacter;
  const storyStyle = input.storyStyle;
  const childPhoto = input.childPhoto;

  if (typeof ageGroup !== "string" || !AGE_GROUPS.includes(ageGroup as (typeof AGE_GROUPS)[number])) {
    return { ok: false, error: "Age group must be one of: 3-5, 6-8, 9-12." };
  }

  if (typeof favoriteCharacter !== "string") {
    return { ok: false, error: "Favorite character is required." };
  }

  const trimmedCharacter = favoriteCharacter.trim();
  if (trimmedCharacter.length < 2 || trimmedCharacter.length > 60) {
    return { ok: false, error: "Favorite character must be between 2 and 60 characters." };
  }

  if (typeof storyStyle !== "string" || !STORY_STYLE_IDS.has(storyStyle as (typeof STORY_STYLE_OPTIONS)[number]["id"])) {
    return { ok: false, error: "Story style is invalid." };
  }

  const photoValidation = validatePhoto(childPhoto);
  if (!photoValidation.ok) {
    return photoValidation;
  }

  return {
    ok: true,
    data: {
      ageGroup: ageGroup as StoryGenerationRequest["ageGroup"],
      favoriteCharacter: trimmedCharacter,
      storyStyle: storyStyle as StoryGenerationRequest["storyStyle"],
      childPhoto: photoValidation.data,
    },
  };
}

