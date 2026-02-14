"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UsernameModal } from "~/app/_components/username-modal";
import { getUsername, setUsername } from "~/lib/username";
import { api } from "~/trpc/react";

export default function Home() {
  const router = useRouter();
  const [username, setUsernameState] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createRoomMutation = api.room.createRoom.useMutation({
    onSuccess: (room) => {
      if (room) {
        router.push(`/r/${room.id}`);
      }
    },
  });

  useEffect(() => {
    const savedUsername = getUsername();
    setUsernameState(savedUsername);
  }, []);

  const handleCreateRoom = () => {
    if (!username) {
      setShowUsernameModal(true);
      return;
    }

    if (!roomName.trim()) {
      return;
    }

    setIsCreating(true);
    createRoomMutation.mutate({
      name: roomName.trim(),
      createdBy: username,
    });
  };

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameState(newUsername);
    setShowUsernameModal(false);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-2xl space-y-8 animate-slide-up">
        {/* hero section */}
        <div className="text-center">
          <div className="mb-4 text-7xl">🎬</div>
          <h1 className="mb-4 text-6xl font-extrabold text-primary-400 sm:text-7xl">
            This One Part
          </h1>
          <p className="text-xl text-text-secondary sm:text-2xl">
            Share your favorite YouTube moments 😅
          </p>
        </div>

        {/* username display */}
        {username && (
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <span className="text-lg">👋 Hey, {username}</span>
            <button
              onClick={() => setShowUsernameModal(true)}
              className="text-sm text-primary-400 underline hover:text-primary-300"
            >
              Change
            </button>
          </div>
        )}

        {/* create room form */}
        <div className="rounded-3xl border border-border/70 bg-surface-800/90 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm">
          <h2 className="mb-6 text-center text-2xl font-bold text-text-primary">
            Create a Room 🚀
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="roomName"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Room Name
              </label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name..."
                className="w-full rounded-2xl border border-border/80 bg-stage-900 px-4 py-3 text-lg text-text-primary transition-all duration-200 placeholder:text-text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300/30"
                maxLength={100}
              />
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={!roomName.trim() || isCreating}
              className="w-full rounded-2xl bg-primary-500 px-8 py-4 text-xl font-bold text-white shadow-lg shadow-primary-900/40 transition-all btn-press-bright hover-lift disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isCreating ? "Creating... ⏳" : "Create Room 🎬"}
            </button>
          </div>
        </div>

        {/* features */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-surface-800/70 p-6 text-center shadow-lg shadow-black/25 backdrop-blur-sm">
            <div className="mb-2 text-4xl">📺</div>
            <h3 className="mb-1 font-semibold text-text-primary">
              Share Clips
            </h3>
            <p className="text-sm text-text-secondary">
              Post YouTube videos with custom timestamps
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-surface-800/70 p-6 text-center shadow-lg shadow-black/25 backdrop-blur-sm">
            <div className="mb-2 text-4xl">😂</div>
            <h3 className="mb-1 font-semibold text-text-primary">
              React
            </h3>
            <p className="text-sm text-text-secondary">
              Add emoji reactions to posts
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-surface-800/70 p-6 text-center shadow-lg shadow-black/25 backdrop-blur-sm">
            <div className="mb-2 text-4xl">🔗</div>
            <h3 className="mb-1 font-semibold text-text-primary">
              Share Link
            </h3>
            <p className="text-sm text-text-secondary">
              Invite friends with a simple link
            </p>
          </div>
        </div>
      </div>

      <UsernameModal
        isOpen={showUsernameModal}
        onSubmit={handleUsernameSubmit}
        onClose={() => setShowUsernameModal(false)}
      />
    </main>
  );
}
