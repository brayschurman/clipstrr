"use client";

import { useState, useEffect } from "react";
import { validateUsername } from "~/lib/username";

type UsernameModalProps = {
  isOpen: boolean;
  onSubmit: (username: string) => void;
  onClose?: () => void;
};

export function UsernameModal({ isOpen, onSubmit, onClose }: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setError(undefined);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateUsername(username);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSubmit(username.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-surface-800 p-8 shadow-2xl shadow-black/40 animate-spring">
        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl">👋</div>
          <h2 className="text-2xl font-bold text-text-primary">
            What&apos;s your name?
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Choose a username to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(undefined);
              }}
              placeholder="Enter your username"
              className="w-full rounded-2xl border border-border/80 bg-stage-900 px-4 py-3 text-lg text-text-primary transition-all duration-200 placeholder:text-text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300/30"
              autoFocus
              maxLength={20}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 animate-slide-up">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary-500 px-6 py-3 text-lg font-semibold text-white shadow-lg btn-press-bright hover-lift"
          >
            Let&apos;s go 🚀
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-border/80 bg-stage-900 px-6 py-3 text-lg font-semibold text-text-secondary btn-press hover:bg-surface-750"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
