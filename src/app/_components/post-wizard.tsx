"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";

type PostWizardProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  username: string;
};

type WizardStep = "url" | "timestamp" | "description";

type YouTubePlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: {
            onReady?: () => void;
          };
        },
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function PostWizard({
  isOpen,
  onClose,
  roomId,
  username,
}: PostWizardProps) {
  const utils = api.useUtils();
  const [step, setStep] = useState<WizardStep>("url");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [previewTime, setPreviewTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const createPostMutation = api.room.createPost.useMutation({
    onSuccess: async () => {
      await utils.room.getRoomPosts.invalidate({ roomId });
      onClose();
      resetForm();
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== "timestamp" || !videoId || !playerContainerRef.current) {
      return;
    }

    let cancelled = false;

    const mountPlayer = () => {
      if (cancelled || !window.YT || !playerContainerRef.current) {
        return;
      }

      if (playerRef.current) {
        playerRef.current.destroy();
      }

      setPlayerReady(false);
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (!cancelled) {
              setPlayerReady(true);
            }
          },
        },
      });
    };

    if (window.YT) {
      mountPlayer();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);

      const existingHandler = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        existingHandler?.();
        mountPlayer();
      };
    }

    return () => {
      cancelled = true;
      setPlayerReady(false);
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [step, videoId]);

  useEffect(() => {
    if (step !== "timestamp" || !playerReady) {
      return;
    }

    const interval = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) {
        return;
      }

      const time = Math.floor(player.getCurrentTime());
      setPreviewTime(Number.isFinite(time) ? time : 0);
    }, 300);

    return () => {
      window.clearInterval(interval);
    };
  }, [step, playerReady]);

  const resetForm = () => {
    setStep("url");
    setYoutubeUrl("");
    setVideoId(null);
    setStartTime(0);
    setDescription("");
    setError(undefined);
    setPreviewTime(0);
    setPlayerReady(false);
  };

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }

    return null;
  };

  const handleUrlSubmit = () => {
    const id = extractVideoId(youtubeUrl);
    if (!id) {
      setError("Invalid YouTube URL. Please try again.");
      return;
    }

    setVideoId(id);
    setError(undefined);
    setStep("timestamp");
  };

  const handleSetStart = () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const time = Math.floor(player.getCurrentTime());
    const safeTime = Number.isFinite(time) && time >= 0 ? time : 0;
    setStartTime(safeTime);
    setError(undefined);
  };

  const handleTimestampNext = () => {
    setError(undefined);
    setStep("description");
  };

  const handlePost = () => {
    if (!videoId) return;

    createPostMutation.mutate({
      roomId,
      youtubeUrl,
      startTime,
      description: description.trim() || undefined,
      createdBy: username,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/65 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-border/70 bg-surface-800 shadow-2xl shadow-black/40 animate-spring">
        {/* header */}
        <div className="border-b border-border/70 bg-stage-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary">
              {step === "url" && "📺 Enter YouTube URL"}
              {step === "timestamp" && "⏱️ Select Start Time"}
              {step === "description" && "📝 Add Description"}
            </h2>
            <button
              onClick={onClose}
              className="text-2xl text-text-secondary transition-transform btn-press hover:text-text-primary"
            >
              ✕
            </button>
          </div>
        </div>

        {/* content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* step 1: url input */}
          {step === "url" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="youtube-url"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  YouTube URL
                </label>
                <input
                  id="youtube-url"
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setError(undefined);
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-2xl border border-border/80 bg-stage-900 px-4 py-3 text-lg text-text-primary transition-all duration-200 placeholder:text-text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300/30"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500 animate-slide-up">
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleUrlSubmit}
                disabled={!youtubeUrl.trim()}
                className="w-full rounded-2xl bg-primary-500 px-6 py-3 text-lg font-semibold text-white shadow-lg btn-press-bright hover-lift disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}

          {/* step 2: timestamp selection */}
          {step === "timestamp" && videoId && (
            <div className="space-y-6">
              {/* video player */}
              <div className="overflow-hidden rounded-2xl">
                <div className="relative aspect-video w-full bg-gray-900">
                  <div ref={playerContainerRef} className="h-full w-full" />
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-border/80 bg-stage-900/70 p-4">
                <p className="text-sm text-text-secondary">
                  Pause at the moment you want and press <span className="font-semibold">Use Current Video Time</span>.
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm text-text-secondary">Current video time</p>
                    <p className="text-2xl font-semibold text-text-primary">
                      {formatTime(previewTime)}
                    </p>
                  </div>
                  <button
                    onClick={handleSetStart}
                    disabled={!playerReady}
                    className="rounded-xl border border-primary-300/50 bg-primary-500 px-4 py-2 text-sm font-semibold text-white btn-press-bright hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Use Current Video Time
                  </button>
                </div>
                <div className="rounded-xl border border-border/80 bg-surface-800 px-3 py-2 text-sm text-text-secondary">
                  Selected start: <span className="font-semibold">{formatTime(startTime)}</span>
                </div>
              </div>

              {error && (
                <p className="text-center text-sm text-red-500 animate-slide-up">
                  {error}
                </p>
              )}

              {/* navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("url")}
                  className="flex-1 rounded-2xl border border-border/80 bg-stage-900 px-6 py-3 font-semibold text-text-secondary btn-press hover:bg-surface-750"
                >
                  ← Back
                </button>
                <button
                  onClick={handleTimestampNext}
                  className="flex-1 rounded-2xl bg-primary-500 px-6 py-3 font-semibold text-white btn-press-bright hover-lift"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* step 3: description */}
          {step === "description" && (
            <div className="space-y-4">
              {/* preview */}
              <div className="rounded-2xl border border-border/80 bg-stage-900/70 p-4">
                <p className="mb-2 text-sm font-medium text-text-secondary">
                  Preview
                </p>
                <p className="text-sm text-text-secondary">
                  Starts at: {formatTime(startTime)}
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a note about this moment..."
                  rows={4}
                  maxLength={500}
                  className="w-full rounded-2xl border border-border/80 bg-stage-900 px-4 py-3 text-lg text-text-primary transition-all duration-200 placeholder:text-text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300/30"
                />
                <p className="mt-1 text-right text-sm text-text-muted">
                  {description.length}/500
                </p>
              </div>

              {error && (
                <p className="text-center text-sm text-red-500 animate-slide-up">
                  {error}
                </p>
              )}

              {/* navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("timestamp")}
                  className="flex-1 rounded-2xl border border-border/80 bg-stage-900 px-6 py-3 font-semibold text-text-secondary btn-press hover:bg-surface-750"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePost}
                  disabled={createPostMutation.isPending}
                  className="flex-1 rounded-2xl bg-primary-500 px-6 py-3 font-semibold text-white btn-press-bright hover-lift disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createPostMutation.isPending ? "Posting... ⏳" : "Post 🎬"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
