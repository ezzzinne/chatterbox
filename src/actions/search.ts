"use server";

import { createClient } from "@/lib/server";

export type SearchPost = {
  id: string;
  author_id: string;
  title: string;
  excerpt: string | null;
  content_markdown: string;
  published_at: string | null;
  rank_score: number;
  like_count?: number;
  bookmark_count?: number;
  comment_count?: number;
  view_count?: number;
  tags: {
    id: string;
    name: string;
  }[];
  author: {
    id: string;
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
};

type Tag = {
  id: string;
  name: string;
};

function normalizeTag(value: Tag | Tag[] | null): Tag[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function searchPostsAction(query: string): Promise<SearchPost[]> {
  const supabase = await createClient();

  const searchQuery = query.trim();

  if (!searchQuery || searchQuery.length < 2) {
    return [];
  }

  const { data: searchResults, error } = await supabase.rpc("search_posts", {
    search_query: searchQuery,
  });

  if (error) {
    console.error("Search posts error:", error);
    throw new Error(error.message);
  }

  const postIds = searchResults?.map((post: SearchPost) => post.id) ?? [];

  const authorIds = [
    ...new Set(searchResults?.map((post: SearchPost) => post.author_id) ?? []),
  ];

  const { data: authors, error: authorsError } = await supabase
    .from("profiles")
    .select("id, name, first_name, last_name, username, avatar_url")
    .in("id", authorIds);

  if (authorsError) {
    console.error("Search authors error:", authorsError);
  }

  const authorsById = new Map(
    (authors ?? []).map((author) => [author.id, author]),
  );

  if (postIds.length === 0) {
    return [];
  }

  const { data: tagRows, error: tagError } = await supabase
    .from("post_tags")
    .select(
      `
      post_id,
      tags (
        id,
        name
      )
    `,
    )
    .in("post_id", postIds);

  if (tagError) {
    console.error("Search post tags error:", tagError);
  }

  const tagsByPostId = new Map<string, Tag[]>();

  for (const row of tagRows ?? []) {
    const currentTags = tagsByPostId.get(row.post_id) ?? [];
    const tags = normalizeTag(row.tags as Tag | Tag[] | null);

    tagsByPostId.set(row.post_id, [...currentTags, ...tags]);
  }

  return (
    searchResults?.map((post: SearchPost) => ({
      id: post.id,
      author_id: post.author_id,
      title: post.title,
      excerpt: post.excerpt,
      content_markdown: post.content_markdown,
      published_at: post.published_at,
      rank_score: Number(post.rank_score ?? 0),
      like_count: Number(post.like_count ?? 0),
      bookmark_count: Number(post.bookmark_count ?? 0),
      comment_count: Number(post.comment_count ?? 0),
      view_count: Number(post.view_count ?? 0),
      tags: tagsByPostId.get(post.id) ?? [],
      author: authorsById.get(post.author_id) ?? null,
    })) ?? []
  );
}
