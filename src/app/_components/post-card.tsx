"use client";

import { useState } from "react";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { EmojiPicker } from "./emoji-picker";

type Reaction = {
  id: number;
  emoji: string;
  createdBy: string;
  postId: number;
  createdAt: Date;
};

type Post = {
  id: number;
  videoId: string;
  startTime: number;
  description: string | null;
  createdBy: string;
  createdAt: Date;
  reactions: Reaction[];
};

type PostCardProps = {
  post: Post;
  username: string;
  onReactionChange: () => void;
};

export function PostCard({ post, username, onReactionChange }: PostCardProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  const addReactionMutation = api.room.addReaction.useMutation({
    onSuccess: () => {
      onReactionChange();
    },
  });

  const removeReactionMutation = api.room.removeReaction.useMutation({
    onSuccess: () => {
      onReactionChange();
    },
  });

  const handleEmojiSelect = (emoji: string) => {
    addReactionMutation.mutate({
      postId: post.id,
      emoji,
      createdBy: username,
    });
    setShowEmojiPicker(false);
  };

  const handleReactionClick = (emoji: string, userReaction: Reaction | undefined) => {
    if (userReaction) {
      // user already reacted with this emoji, remove it
      removeReactionMutation.mutate({
        reactionId: userReaction.id,
        createdBy: username,
      });
    } else {
      // add new reaction
      handleEmojiSelect(emoji);
    }
  };

  // group reactions by emoji
  const reactionGroups = post.reactions.reduce(
    (acc, reaction) => {
      acc[reaction.emoji] ??= [];
      acc[reaction.emoji]!.push(reaction);
      return acc;
    },
    {} as Record<string, Reaction[]>,
  );

  const embedUrl = `https://www.youtube.com/embed/${post.videoId}?start=${post.startTime}&autoplay=0`;
  const postedAtLabel = format(
    new Date(post.createdAt),
    "EEEE, MMMM d, yyyy 'at' h:mm a",
  );
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface-800/95 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/35 animate-slide-up">
      {/* video embed */}
      <div className="relative aspect-video w-full bg-gray-900">
        <iframe
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>

      {/* content */}
      <div className="p-4">
        {/* metadata */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="font-semibold text-text-primary">
              {post.createdBy}
            </span>
          </div>
          <span className="text-sm text-text-muted">
            {postedAtLabel}
          </span>
        </div>

        {/* timestamp info */}
        <div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">
          <span>⏱️</span>
          <span>Starts at {formatTime(post.startTime)}</span>
        </div>

        {/* description */}
        {post.description && (
          <p className="mb-4 text-text-secondary">{post.description}</p>
        )}

        {/* reactions */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(reactionGroups).map(([emoji, reactions]) => {
            const userReaction = reactions.find((r) => r.createdBy === username);
            const userReacted = !!userReaction;
            const reactorNames = reactions.map((r) => r.createdBy);
            const tooltipText = formatReactorNames(reactorNames, username);
            
            return (
              <div key={emoji} className="relative group">
                <button
                  onClick={() => handleReactionClick(emoji, userReaction)}
                  onMouseEnter={() => setHoveredEmoji(emoji)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                  className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 btn-press ${
                    userReacted
                      ? "bg-primary-200 text-primary-700 ring-2 ring-primary-400/70 hover:ring-primary-500/80"
                      : "border border-border/80 bg-stage-900 text-text-secondary hover:bg-surface-750 hover:border-border"
                  }`}
                >
                  <span className="mr-1.5 text-base">{emoji}</span>
                  <span className="font-semibold">{reactions.length}</span>
                </button>
                
                {/* tooltip */}
                {hoveredEmoji === emoji && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-800 border border-border/70 rounded-lg shadow-xl shadow-black/40 whitespace-nowrap text-sm text-text-primary z-10 animate-fade-in pointer-events-none">
                    <div className="font-medium">{tooltipText}</div>
                    {/* tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div className="border-4 border-transparent border-t-surface-800" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* add reaction button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`rounded-full border px-3 py-1.5 text-lg transition-all duration-200 btn-press ${
                showEmojiPicker
                  ? "border-primary-400/70 bg-primary-200 text-primary-700"
                  : "border-border/80 bg-stage-900 text-text-secondary hover:bg-surface-750 hover:border-border"
              }`}
              aria-label="Add reaction"
            >
              {showEmojiPicker ? "✕" : "➕"}
            </button>

            {showEmojiPicker && (
              <EmojiPicker
                onSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>
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

function formatReactorNames(names: string[], currentUser: string): string {
  const uniqueNames = Array.from(new Set(names));
  const youIndex = uniqueNames.indexOf(currentUser);
  
  if (youIndex !== -1) {
    uniqueNames.splice(youIndex, 1);
    uniqueNames.unshift("You");
  }
  
  if (uniqueNames.length === 1) {
    return uniqueNames[0]!;
  } else if (uniqueNames.length === 2) {
    return `${uniqueNames[0]} and ${uniqueNames[1]}`;
  } else if (uniqueNames.length === 3) {
    return `${uniqueNames[0]}, ${uniqueNames[1]}, and ${uniqueNames[2]}`;
  } else {
    const remaining = uniqueNames.length - 2;
    return `${uniqueNames[0]}, ${uniqueNames[1]}, and ${remaining} other${remaining > 1 ? "s" : ""}`;
  }
}
