import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TagCard } from "../tag-card";

describe("TagCard", () => {
  it("renders the tag name", () => {
    render(
      <TagCard
        tag={{
          id: "tag-1",
          name: "React",
          post_count: 12,
          isFollowing: false,
        }}
      />,
    );

    expect(screen.getByText("#React")).toBeInTheDocument();
  });

  it("renders the post count", () => {
    render(
      <TagCard
        tag={{
          id: "tag-1",
          name: "Supabase",
          post_count: 8,
          isFollowing: false,
        }}
      />,
    );

    expect(screen.getByText("8 posts")).toBeInTheDocument();
  });

  it("defaults post count to 0 when post_count is missing", () => {
    render(
      <TagCard
        tag={{
          id: "tag-1",
          name: "Next.js",
          isFollowing: false,
        }}
      />,
    );

    expect(screen.getByText("0 posts")).toBeInTheDocument();
  });

  it("shows Follow when the user is not following the tag", () => {
    render(
      <TagCard
        tag={{
          id: "tag-1",
          name: "TypeScript",
          post_count: 4,
          isFollowing: false,
        }}
      />,
    );

    expect(screen.getByText("Follow")).toBeInTheDocument();
  });

  it("shows Following when the user is following the tag", () => {
    render(
      <TagCard
        tag={{
          id: "tag-1",
          name: "JavaScript",
          post_count: 15,
          isFollowing: true,
        }}
      />,
    );

    expect(screen.getByText("Following")).toBeInTheDocument();
  });

  it("links to the tag details page", () => {
    render(
      <TagCard
        tag={{
          id: "tag-123",
          name: "Testing",
          post_count: 3,
          isFollowing: false,
        }}
      />,
    );

    const link = screen.getByRole("link", { name: /follow/i });

    expect(link).toHaveAttribute("href", "/dashboard/tags/tag-123");
  });
});
