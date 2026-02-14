import { z } from "zod";

const YOUTUBE_VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

function isValidVideoId(value: string): boolean {
  return YOUTUBE_VIDEO_ID_REGEX.test(value);
}

function normalizeUrlInput(input: string): URL | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed);
  } catch {
    try {
      return new URL(`https://${trimmed}`);
    } catch {
      return null;
    }
  }
}

export function parseYouTubeVideo(
  input: string,
): { videoId: string; url: string } | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  if (isValidVideoId(trimmed)) {
    return {
      videoId: trimmed,
      url: `https://www.youtube.com/watch?v=${trimmed}`,
    };
  }

  const parsedUrl = normalizeUrlInput(trimmed);
  if (!parsedUrl) {
    return null;
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) {
    return null;
  }

  let videoId: string | null = null;
  const path = parsedUrl.pathname;

  if (host.includes("youtu.be")) {
    const segments = path.split("/").filter(Boolean);
    videoId = segments[0] ?? null;
  } else if (path === "/watch") {
    videoId =
      parsedUrl.searchParams.get("v") ?? parsedUrl.searchParams.get("vi");
  } else {
    const match = /^\/(?:embed|shorts|live)\/([^/?#]+)/.exec(path);
    videoId = match?.[1] ?? null;
  }

  if (!videoId || !isValidVideoId(videoId)) {
    return null;
  }

  return {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

export const youtubeVideoSchema = z.string().trim().transform((value, ctx) => {
  const parsed = parseYouTubeVideo(value);
  if (!parsed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid YouTube URL or video ID",
    });
    return z.NEVER;
  }

  return parsed;
});
