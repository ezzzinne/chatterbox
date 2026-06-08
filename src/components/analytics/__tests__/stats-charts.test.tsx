import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatsCharts } from "../stats-charts";

describe("StatsCharts", () => {
  it("renders analytics metric cards", () => {
    render(
      <StatsCharts
        data={[
          {
            day: "2026-06-01",
            views: 4,
            unique_readers: 2,
            likes: 1,
            comments: 1,
            bookmarks: 1,
          },
          {
            day: "2026-06-02",
            views: 6,
            unique_readers: 3,
            likes: 2,
            comments: 0,
            bookmarks: 1,
          },
        ]}
      />,
    );

    expect(screen.getByText("Views")).toBeInTheDocument();
    expect(screen.getByText("Unique Readers")).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
  });
});
