import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CommentsSection } from "../comment-section";

describe("CommentsSection", () => {
  it("renders comments and replies", () => {
    render(
      <CommentsSection
        postId="post-1"
        currentUserId="user-1"
        initialComments={[
          {
            id: "comment-1",
            post_id: "post-1",
            author_id: "user-2",
            parent_id: null,
            body: "Top level comment",
            depth: 0,
            created_at: "2026-06-07T12:00:00Z",
            author: {
              id: "user-2",
              name: "Jane Doe",
              first_name: "Jane",
              last_name: "Doe",
              username: "jane",
              avatar_url: null,
            },
          },
          {
            id: "reply-1",
            post_id: "post-1",
            author_id: "user-3",
            parent_id: "comment-1",
            body: "This is a reply",
            depth: 1,
            created_at: "2026-06-07T12:05:00Z",
            author: {
              id: "user-3",
              name: "John Doe",
              first_name: "John",
              last_name: "Doe",
              username: "john",
              avatar_url: null,
            },
          },
        ]}
      />,
    );

    expect(screen.getByText("Top level comment")).toBeInTheDocument();
    expect(screen.getByText("This is a reply")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });
});
