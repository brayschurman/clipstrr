"use client";

import { useEffect, useRef, useState } from "react";

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
  onClose: () => void;
};

type EmojiCategory = {
  name: string;
  emojis: string[];
};

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: "Frequently used",
    emojis: ["👍", "❤️", "😂", "🔥", "✅", "🎉", "👏", "💯"],
  },
  {
    name: "Smileys",
    emojis: [
      "😀", "😃", "😄", "😁", "😊", "😇", "🙂", "🙃",
      "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
      "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓",
      "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔",
      "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩",
      "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯",
    ],
  },
  {
    name: "Gestures",
    emojis: [
      "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️",
      "🤟", "🤘", "👌", "🤌", "🤏", "👈", "👉", "👆",
      "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏",
      "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾",
    ],
  },
  {
    name: "Hearts",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
      "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗",
      "💖", "💘", "💝", "💟",
    ],
  },
  {
    name: "Symbols",
    emojis: [
      "🔥", "⭐", "✨", "💫", "⚡", "💥", "💢", "💯",
      "✅", "❌", "⚠️", "🚫", "💬", "💭", "🗨️", "🗯️",
      "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉",
    ],
  },
];

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const currentEmojis = EMOJI_CATEGORIES[selectedCategory]?.emojis ?? [];
  const filteredEmojis = searchQuery
    ? currentEmojis.filter((emoji) => emoji.includes(searchQuery))
    : currentEmojis;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full right-0 mb-2 w-80 rounded-2xl border border-border/70 bg-surface-800 shadow-2xl shadow-black/40 animate-spring overflow-hidden"
    >
      {/* search bar */}
      <div className="p-3 border-b border-border/50">
        <input
          type="text"
          placeholder="Search emoji..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-stage-900 border border-border/80 rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all"
          autoFocus
        />
      </div>

      {/* category tabs */}
      <div className="flex gap-1 px-3 py-2 border-b border-border/50 overflow-x-auto">
        {EMOJI_CATEGORIES.map((category, index) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(index)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
              selectedCategory === index
                ? "bg-primary-200 text-primary-700"
                : "text-text-secondary hover:bg-stage-900 hover:text-text-primary"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* emoji grid */}
      <div className="p-3 max-h-64 overflow-y-auto">
        {filteredEmojis.length > 0 ? (
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onSelect(emoji)}
                className="rounded-lg p-2 text-2xl transition-all duration-150 btn-press hover:bg-stage-900 hover:scale-110"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted text-sm">
            No emojis found
          </div>
        )}
      </div>
    </div>
  );
}
