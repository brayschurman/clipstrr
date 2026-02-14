"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UsernameModal } from "~/app/_components/username-modal";
import { InfiniteFeed } from "~/app/_components/infinite-feed";
import { PostWizard } from "~/app/_components/post-wizard";
import { getUsername, setUsername } from "~/lib/username";
import { api } from "~/trpc/react";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [username, setUsernameState] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPostWizard, setShowPostWizard] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: room, isLoading } = api.room.getRoom.useQuery({ roomId });

  useEffect(() => {
    const savedUsername = getUsername();
    if (!savedUsername) {
      setShowUsernameModal(true);
    } else {
      setUsernameState(savedUsername);
    }
  }, []);

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameState(newUsername);
    setShowUsernameModal(false);
  };

  const handleShareRoom = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostClick = () => {
    if (!username) {
      setShowUsernameModal(true);
      return;
    }
    setShowPostWizard(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl animate-bounce">🎬</div>
          <p className="text-xl text-text-secondary">Loading room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">😕</div>
          <h1 className="mb-2 text-2xl font-bold text-text-primary">
            Room not found
          </h1>
          <p className="mb-6 text-text-secondary">
            This room doesn&apos;t exist or has been deleted.
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-2xl bg-primary-500 px-6 py-3 font-semibold text-white btn-press-bright hover-lift"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* header */}
      <header className="sticky top-0 z-10 border-b border-border/70 bg-stage-900/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="text-2xl btn-press"
              >
                🏠
              </button>
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  {room.name}
                </h1>
                {username && (
                  <p className="text-sm text-text-secondary">
                    Joined as {username}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleShareRoom}
              className="rounded-2xl bg-primary-500 px-4 py-2 font-semibold text-white btn-press-bright hover-lift"
            >
              {copied ? "Copied ✓" : "Share 🔗"}
            </button>
          </div>
        </div>
      </header>

      {/* feed */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-3xl border border-border/60 bg-stage-900/45 p-4 shadow-[0_18px_44px_oklch(0.08_0.02_265_/_0.45)] backdrop-blur-sm sm:p-6">
          {username && <InfiniteFeed roomId={roomId} username={username} />}
        </div>
      </main>

      {/* floating post button */}
      <button
        onClick={handlePostClick}
        className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/30 bg-gradient-to-br from-primary-300 via-primary-400 to-primary-500 px-3 py-3 text-white shadow-[0_20px_40px_oklch(0.09_0.03_260_/_0.55)] ring-1 ring-primary-200/50 btn-press-bright hover-lift sm:gap-3 sm:px-4"
        aria-label="Post video"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-2xl font-black leading-none text-white sm:h-11 sm:w-11">
          +
        </span>
        <span className="pr-1 text-sm font-extrabold tracking-wide sm:text-base">
          Add Clip
        </span>
      </button>

      {/* modals */}
      <UsernameModal
        isOpen={showUsernameModal}
        onSubmit={handleUsernameSubmit}
      />

      {username && (
        <PostWizard
          isOpen={showPostWizard}
          onClose={() => setShowPostWizard(false)}
          roomId={roomId}
          username={username}
        />
      )}
    </div>
  );
}
