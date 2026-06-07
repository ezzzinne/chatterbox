import { describe, expect, it } from "vitest";
import { validatePostForm } from "../post-validation";

describe("validatePostForm", () => {
  it("rejects empty title and content", () => {
    const result = validatePostForm({
      title: "",
      content: "",
      selectedTagIds: [],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.title).toBe("Title is required.");
    expect(result.errors.content).toBe("Content is required.");
  });

  it("rejects more than 5 tags", () => {
    const result = validatePostForm({
      title: "My post",
      content: "Content",
      selectedTagIds: ["1", "2", "3", "4", "5", "6"],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.tags).toBe("You can select up to 5 tags.");
  });
});
