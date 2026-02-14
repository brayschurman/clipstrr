"use client";

import { useEffect, useRef, useState } from "react";
import {
  REACTION_ICONS,
  getReactionIconByToken,
  getReactionTokenFromIconKey,
} from "./reaction-icons";

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
  onClose: () => void;
};

type EmojiCategory = {
  name: string;
  items: ReactionPickerItem[];
};

type ReactionPickerItem = {
  value: string;
  label: string;
  keywords: string[];
};

const toEmojiItems = (emojis: string[]): ReactionPickerItem[] =>
  emojis.map((emoji) => ({
    value: emoji,
    label: emoji,
    keywords: [emoji],
  }));

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: "Frequently used",
    items: toEmojiItems(["👍", "❤️", "😂", "🔥", "✅", "🎉", "👏", "💯"]),
  },
  {
    name: "Funny icons",
    items: REACTION_ICONS.map((icon) => ({
      value: getReactionTokenFromIconKey(icon.key),
      label: icon.label,
      keywords: [icon.label, ...icon.keywords],
    })),
  },
  {
    name: "Smileys",
    items: toEmojiItems([
      "😀", "😃", "😄", "😁", "😊", "😇", "🙂", "🙃",
      "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
      "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓",
      "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔",
      "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩",
      "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯",
    ]),
  },
  {
    name: "Gestures",
    items: toEmojiItems([
      "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️",
      "🤟", "🤘", "👌", "🤌", "🤏", "👈", "👉", "👆",
      "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏",
      "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾",
    ]),
  },
  {
    name: "Hearts",
    items: toEmojiItems([
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
      "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗",
      "💖", "💘", "💝", "💟",
    ]),
  },
  {
    name: "Symbols",
    items: toEmojiItems([
      "🔥", "⭐", "✨", "💫", "⚡", "💥", "💢", "💯",
      "✅", "❌", "⚠️", "🚫", "💬", "💭", "🗨️", "🗯️",
      "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉",
    ]),
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

  const currentItems = EMOJI_CATEGORIES[selectedCategory]?.items ?? [];
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredItems = normalizedSearch
    ? currentItems.filter((item) =>
        [item.value, item.label, ...item.keywords].some((field) =>
          field.toLowerCase().includes(normalizedSearch),
        ),
      )
    : currentItems;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-0 left-full z-50 ml-2 w-80 overflow-hidden rounded-2xl border border-border/70 bg-surface-800 shadow-2xl shadow-black/40 animate-spring"
    >
      {/* search bar */}
      <div className="p-3 border-b border-border/50">
        <input
          type="text"
          placeholder="Search reactions..."
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

      {/* reaction grid */}
      <div className="p-3 max-h-64 overflow-y-auto">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-8 gap-1">
            {filteredItems.map((item) => {
              const icon = getReactionIconByToken(item.value);

              return (
                <button
                  key={item.value}
                  onClick={() => onSelect(item.value)}
                  className="rounded-lg p-2 transition-all duration-150 btn-press hover:bg-stage-900 hover:scale-110"
                  title={item.label}
                >
                  {icon ? (
                    <icon.Icon className="mx-auto size-5 text-text-primary" />
                  ) : (
                    <span className="text-2xl">{item.value}</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted text-sm">
            No reactions found
          </div>
        )}
      </div>
    </div>
  );
}
