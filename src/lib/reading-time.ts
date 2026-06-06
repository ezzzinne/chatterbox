export function calculateReadingTime(content?: string | null) {
  const safeContent = content ?? "";

  const wordCount = safeContent.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 200));
}
