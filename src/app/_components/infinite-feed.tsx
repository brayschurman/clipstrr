"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { PostCard } from "./post-card";

type InfiniteFeedProps = {
  roomId: string;
  username: string;
};

export function InfiniteFeed({ roomId, username }: InfiniteFeedProps) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = api.room.getRoomPosts.useInfiniteQuery(
    {
      roomId,
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array<undefined>(3)].map((_, i) => (
          <div
            key={i}
            className="h-96 rounded-2xl bg-surface-800 animate-shimmer"
          />
        ))}
      </div>
    );
  }

  const allPages = data?.pages ?? [];
  const posts = allPages.flatMap((page) => page.posts);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-8xl">🎬</div>
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          No posts yet
        </h2>
        <p className="mb-6 text-text-secondary">
          Be the first to share a YouTube clip
        </p>
        <div className="text-4xl">👇</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id}>
          <PostCard
            post={post}
            username={username}
            onReactionChange={() => void refetch()}
          />
        </div>
      ))}

      {/* loading indicator */}
      {hasNextPage && (
        <div ref={ref} className="py-8 text-center">
          {isFetchingNextPage ? (
            <div className="text-4xl animate-bounce">⏳</div>
          ) : (
            <div className="text-2xl">👀</div>
          )}
        </div>
      )}

    </div>
  );
}
