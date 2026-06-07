import { describe, expect, it } from "vitest";
import { sortFeedPosts } from "../feed-sort";

describe("sortFeedPosts", () => {
  it("sorts posts by score first", () => {
    const posts = [
      { id: "a", score: 1, published_at: "2026-06-01T00:00:00Z" },
      { id: "b", score: 5, published_at: "2026-06-01T00:00:00Z" },
    ];

    expect(sortFeedPosts(posts).map((post) => post.id)).toEqual(["b", "a"]);
  });

  it("uses published_at as tie breaker", () => {
    const posts = [
      { id: "old", score: 2, published_at: "2026-06-01T00:00:00Z" },
      { id: "new", score: 2, published_at: "2026-06-05T00:00:00Z" },
    ];

    expect(sortFeedPosts(posts).map((post) => post.id)).toEqual(["new", "old"]);
  });
});
