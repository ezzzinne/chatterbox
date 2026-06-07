import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostCard } from "../post-card";

describe("PostCard", () => {
  it("renders post title, excerpt, and metrics", () => {
    render(
      <PostCard
        post={{
          id: "post-1",
          title: "Testing Chatter",
          excerpt: "This is a test post.",
          content_markdown: "This is a test post.",
          published_at: "2026-06-07T12:00:00Z",
          like_count: 3,
          bookmark_count: 2,
          comment_count: 5,
          view_count: 20,
        }}
      />,
    );

    expect(screen.getByText("Testing Chatter")).toBeInTheDocument();
    expect(screen.getByText("This is a test post.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read/i })).toBeInTheDocument();
  });
});
