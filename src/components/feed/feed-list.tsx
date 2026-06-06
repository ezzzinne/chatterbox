"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { PostCard } from "@/components/post/post-card";
import { FeedPost, getMoreFeedPostsAction } from "@/actions/feed";

export function FeedList({ initialPosts = [] }: { initialPosts?: FeedPost[] }) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(
    initialPosts.at(-1)?.published_at ?? null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoaded] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    try {
      setIsLoading(true);

      const result = await getMoreFeedPostsAction(cursor);

      setPosts((current) => {
        const existingIds = new Set(current.map((post) => post.id));

        const newPosts = result.posts.filter(
          (post) => !existingIds.has(post.id),
        );

        return [...current, ...newPosts];
      });

      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [cursor]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [loadMore]);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {posts.map((post, index) => (
        <div key={post.id} className="space-y-4">
          <PostCard post={post} />

          {index < posts.length - 1 && <div className="my-8 border-b" />}
        </div>
      ))}

      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex min-h-24 items-center justify-center py-8"
        >
          {isLoading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading articles...
            </div>
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            You&apos;ve reached the end of the feed
          </p>
        </div>
      )}

      {hasLoaded && !isLoading && posts.length === 0 && (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium">No articles found</p>

          <p className="mt-2 text-sm text-muted-foreground">
            Check back later for new content.
          </p>
        </div>
      )}
    </div>
  );
}
