export type PostFormInput = {
  title: string;
  content: string;
  selectedTagIds: string[];
};

export function validatePostForm(input: PostFormInput) {
  const errors: Record<string, string> = {};

  if (!input.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!input.content.trim()) {
    errors.content = "Content is required.";
  }

  if (input.selectedTagIds.length > 5) {
    errors.tags = "You can select up to 5 tags.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
