"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import {
  AGE_GROUPS,
  STORY_STYLE_OPTIONS,
  type AgeGroup,
  type StoryGenerationRequest,
  type StoryGenerationResponse,
  type StoryStyleId,
  type UploadedChildPhoto,
} from "@/types/story";
import { STORY_SESSION_STORAGE_KEY } from "@/lib/story-session";
import {
  Button,
  Card,
  Input,
  PlayfulLoader,
  SegmentedControl,
  SelectableCardGrid,
} from "@/components/ui";

type FormErrors = Partial<Record<"childPhoto" | "ageGroup" | "favoriteCharacter" | "storyStyle", string>>;

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES: UploadedChildPhoto["mimeType"][] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const STORY_STYLE_DESCRIPTIONS: Record<StoryStyleId, string> = {
  "space-adventure": "Rocket rides, star maps, and friendly cosmic surprises.",
  "fairy-tale": "Kind magic, sparkling forests, and a warm happy ending.",
  "jungle-quest": "Animal friends, hidden paths, and brave discoveries.",
  "underwater-mission": "Coral reefs, gentle sea creatures, and splashy adventures.",
};

const STORY_STYLE_ACCENTS = ["sky", "sun", "mint", "peach"] as const;
const LOADING_MESSAGES = [
  "Warming up the story world...",
  "Choosing bright colors for the picture...",
  "Writing the magical ending...",
];

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read file."));
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function extractBase64FromDataUrl(dataUrl: string) {
  const commaIndex = dataUrl.indexOf(",");
  return commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
}

function persistStoryToSessionStorage(story: StoryGenerationResponse) {
  if (typeof window === "undefined") {
    return;
  }

  // Avoid storing the image twice: `imageUrl` already contains the base64 data.
  const slimStory: StoryGenerationResponse =
    story.imageUrl && story.imageBase64
      ? { ...story, imageBase64: undefined }
      : story;

  window.sessionStorage.setItem(
    STORY_SESSION_STORAGE_KEY,
    JSON.stringify(slimStory),
  );
}

function validateFormValues(values: {
  childPhoto: UploadedChildPhoto | null;
  ageGroup: AgeGroup;
  favoriteCharacter: string;
  storyStyle: StoryStyleId;
}): FormErrors {
  const errors: FormErrors = {};
  const trimmedCharacter = values.favoriteCharacter.trim();

  if (!values.childPhoto) {
    errors.childPhoto = "Please upload a photo to personalize the story illustration.";
  }

  if (!AGE_GROUPS.includes(values.ageGroup)) {
    errors.ageGroup = "Please select an age group.";
  }

  if (trimmedCharacter.length < 2) {
    errors.favoriteCharacter = "Enter a favorite character name (at least 2 characters).";
  } else if (trimmedCharacter.length > 60) {
    errors.favoriteCharacter = "Keep the character name under 60 characters.";
  }

  if (!STORY_STYLE_OPTIONS.some((option) => option.id === values.storyStyle)) {
    errors.storyStyle = "Please choose a story style.";
  }

  return errors;
}

export function StoryCreatorForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingTimerRef = useRef<number | null>(null);

  const [ageGroup, setAgeGroup] = useState<AgeGroup>("6-8");
  const [favoriteCharacter, setFavoriteCharacter] = useState("A brave dragon");
  const [storyStyle, setStoryStyle] = useState<StoryStyleId>("space-adventure");
  const [childPhoto, setChildPhoto] = useState<UploadedChildPhoto | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [photoFileSize, setPhotoFileSize] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isPreparingPhoto, setIsPreparingPhoto] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }

      if (loadingTimerRef.current !== null) {
        window.clearInterval(loadingTimerRef.current);
      }
    };
  }, [photoPreviewUrl]);

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingMessageIndex(0);

      if (loadingTimerRef.current !== null) {
        window.clearInterval(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }

      return;
    }

    loadingTimerRef.current = window.setInterval(() => {
      setLoadingMessageIndex((current) => (current + 1) % LOADING_MESSAGES.length);
    }, 1400);

    return () => {
      if (loadingTimerRef.current !== null) {
        window.clearInterval(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }, [isSubmitting]);

  async function handleSelectedFile(file: File) {
    setSubmitError(null);
    setErrors((current) => ({ ...current, childPhoto: undefined }));

    if (!ALLOWED_FILE_TYPES.includes(file.type as UploadedChildPhoto["mimeType"])) {
      setErrors((current) => ({
        ...current,
        childPhoto: "Photo must be a JPG, PNG, or WebP image.",
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((current) => ({
        ...current,
        childPhoto: "Photo must be 5MB or smaller.",
      }));
      return;
    }

    setIsPreparingPhoto(true);

    try {
      const dataUrl = await fileToDataUrl(file);
      const nextPreviewUrl = URL.createObjectURL(file);

      setPhotoPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return nextPreviewUrl;
      });

      setPhotoFileName(file.name);
      setPhotoFileSize(file.size);
      setChildPhoto({
        base64Data: extractBase64FromDataUrl(dataUrl),
        mimeType: file.type as UploadedChildPhoto["mimeType"],
        fileName: file.name,
      });
    } catch {
      setErrors((current) => ({
        ...current,
        childPhoto: "We could not read that image file. Please try another photo.",
      }));
    } finally {
      setIsPreparingPhoto(false);
    }
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    void handleSelectedFile(file);

    // Allow selecting the same file again after removing/resetting.
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingFile(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    void handleSelectedFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!isDraggingFile) {
      setIsDraggingFile(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingFile(false);
  }

  function handleResetForm() {
    setAgeGroup("6-8");
    setFavoriteCharacter("");
    setStoryStyle("space-adventure");
    setChildPhoto(null);
    setPhotoFileName(null);
    setPhotoFileSize(null);
    setErrors({});
    setSubmitError(null);

    setPhotoPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validateFormValues({
      childPhoto,
      ageGroup,
      favoriteCharacter,
      storyStyle,
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !childPhoto) {
      return;
    }

    const payload: StoryGenerationRequest = {
      ageGroup,
      favoriteCharacter: favoriteCharacter.trim(),
      storyStyle,
      childPhoto,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as
        | StoryGenerationResponse
        | { error?: string; missingKeys?: string[] };

      if (!response.ok) {
        const missingKeys =
          "missingKeys" in data && Array.isArray(data.missingKeys)
            ? ` Missing: ${data.missingKeys.join(", ")}.`
            : "";

        throw new Error(
          ("error" in data && typeof data.error === "string"
            ? data.error
            : "Story generation failed.") + missingKeys,
        );
      }

      persistStoryToSessionStorage(data);

      startTransition(() => {
        router.push("/story");
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the story.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-line bg-gradient-to-r from-mint/25 via-white to-sky/20 px-5 py-4">
          <p className="text-sm font-semibold text-mint-deep">Step 1 of 2</p>
          <h1 className="mt-1 text-3xl leading-tight text-foreground sm:text-4xl">
            Story Creator
          </h1>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Child Photo
              </label>
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={[
                  "rounded-3xl border-2 border-dashed bg-white p-4 transition",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky/25",
                  isDraggingFile
                    ? "border-sky bg-sky/5"
                    : errors.childPhoto
                      ? "border-peach bg-peach/10"
                      : "border-line hover:border-sky/50 hover:bg-sky/5",
                ].join(" ")}
                aria-label="Upload child photo"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={isSubmitting || isPreparingPhoto}
                />

                {photoPreviewUrl ? (
                  <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
                    <div className="overflow-hidden rounded-2xl border border-line bg-muted/40">
                      <Image
                        src={photoPreviewUrl}
                        alt="Uploaded child photo preview"
                        width={420}
                        height={320}
                        unoptimized
                        className="h-32 w-full object-cover sm:h-28"
                      />
                    </div>
                    <div>
                      <p className="font-display text-lg text-foreground">Photo ready</p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {photoFileName ?? "Uploaded image"}
                        {photoFileSize ? ` • ${formatFileSize(photoFileSize)}` : ""}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink-soft">
                        Click to replace, or use the remove button below.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid min-h-44 place-items-center rounded-2xl border border-line bg-gradient-to-br from-white to-muted/40 p-6 text-center">
                    <div>
                      <p className="font-display text-xl text-foreground">
                        Drop a photo here or click to upload
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink-soft">
                        JPG, PNG, or WebP up to 5MB. We only use it as illustration reference.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || isPreparingPhoto}
                >
                  {photoPreviewUrl ? "Replace Photo" : "Choose Photo"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setChildPhoto(null);
                    setPhotoFileName(null);
                    setPhotoFileSize(null);
                    setErrors((current) => ({ ...current, childPhoto: undefined }));
                    setPhotoPreviewUrl((current) => {
                      if (current) {
                        URL.revokeObjectURL(current);
                      }
                      return null;
                    });
                  }}
                  disabled={(!photoPreviewUrl && !childPhoto) || isSubmitting || isPreparingPhoto}
                >
                  Remove Photo
                </Button>
                {isPreparingPhoto ? (
                  <PlayfulLoader className="py-1.5" label="Preparing photo..." />
                ) : null}
              </div>
              {errors.childPhoto ? (
                <p className="mt-2 text-sm font-semibold text-[#a6512b]">{errors.childPhoto}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Favorite Character
              </label>
              <Input
                value={favoriteCharacter}
                onChange={(event) => {
                  setFavoriteCharacter(event.target.value);
                  if (errors.favoriteCharacter) {
                    setErrors((current) => ({ ...current, favoriteCharacter: undefined }));
                  }
                }}
                placeholder="e.g. A brave dragon, Princess Luna, or Robo Pup"
                maxLength={60}
                disabled={isSubmitting}
              />
              <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <span className="text-ink-soft">Use a simple name or short description.</span>
                <span className="font-semibold text-ink-soft">
                  {favoriteCharacter.trim().length}/60
                </span>
              </div>
              {errors.favoriteCharacter ? (
                <p className="mt-2 text-sm font-semibold text-[#a6512b]">
                  {errors.favoriteCharacter}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Age Group</p>
              <SegmentedControl
                ariaLabel="Select age group"
                value={ageGroup}
                onChange={(value) => {
                  setAgeGroup(value as AgeGroup);
                  if (errors.ageGroup) {
                    setErrors((current) => ({ ...current, ageGroup: undefined }));
                  }
                }}
                options={AGE_GROUPS.map((group) => ({ value: group, label: group }))}
                className="max-w-md"
              />
              {errors.ageGroup ? (
                <p className="mt-2 text-sm font-semibold text-[#a6512b]">{errors.ageGroup}</p>
              ) : null}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Story Style</p>
              <SelectableCardGrid
                ariaLabel="Select story style"
                value={storyStyle}
                onChange={(value) => {
                  setStoryStyle(value as StoryStyleId);
                  if (errors.storyStyle) {
                    setErrors((current) => ({ ...current, storyStyle: undefined }));
                  }
                }}
                options={STORY_STYLE_OPTIONS.map((style, index) => ({
                  id: style.id,
                  label: style.label,
                  description: STORY_STYLE_DESCRIPTIONS[style.id],
                  accent: STORY_STYLE_ACCENTS[index % STORY_STYLE_ACCENTS.length],
                }))}
              />
              {errors.storyStyle ? (
                <p className="mt-2 text-sm font-semibold text-[#a6512b]">{errors.storyStyle}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-white/80 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Ready to generate a personalized story
              </p>
              <p className="text-sm text-ink-soft">
                We use your photo and choices to create a personalized story and picture.
              </p>
              {isSubmitting ? (
                <PlayfulLoader
                  label={LOADING_MESSAGES[loadingMessageIndex]}
                  className="w-fit"
                />
              ) : null}
              {submitError ? (
                <p className="text-sm font-semibold text-[#a6512b]">{submitError}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetForm}
                disabled={isSubmitting || isPreparingPhoto}
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                variant="mint"
                size="lg"
                disabled={isSubmitting || isPreparingPhoto}
              >
                {isSubmitting ? "Creating Story..." : "Generate Story"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

    </form>
  );
}
