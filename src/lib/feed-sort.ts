export type SortablePost = {
  id: string;
  published_at: string | null;
  matched_tag_count?: number;
  score?: number;
};

export function sortFeedPosts<T extends SortablePost>(posts: T[]) {
  return [...posts].sort((a, b) => {
    const scoreA = Number(a.score ?? 0);
    const scoreB = Number(b.score ?? 0);

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;

    return dateB - dateA;
  });
}
