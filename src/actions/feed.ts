"use server";

import { createClient } from "@/lib/server";

export type FeedPost = {
  id: string;
  author_id: string;
  title: string;
  excerpt: string | null;
  content_markdown: string;
  published_at: string | null;
  matched_tag_count?: number;
  score?: number;
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

type FeedResult = {
  posts: FeedPost[];
  nextCursor: string | null;
  hasMore: boolean;
};

const PAGE_SIZE = 20;

type Tag = {
  id: string;
  name: string;
};

function normalizeTag(value: Tag | Tag[] | null): Tag[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function getMoreFeedPostsAction(
  cursor: string | null,
): Promise<FeedResult> {
  const supabase = await createClient();

  const { data: feedRows, error } = await supabase.rpc(
    "get_personalized_feed",
    {
      page_limit: PAGE_SIZE + 1,
      cursor_published_at: cursor,
    },
  );

  if (error) {
    console.error("Personalized feed error:", error);
    throw new Error(error.message);
  }

  const rows = feedRows ?? [];

  const hasMore = rows.length > PAGE_SIZE;
  const pageRows = rows.slice(0, PAGE_SIZE);

  const postIds = pageRows.map((post: FeedPost) => post.id);

  const authorIds = [
    ...new Set(pageRows.map((post: FeedPost) => post.author_id)),
  ];

  const { data: authors, error: authorsError } = await supabase
    .from("profiles")
    .select("id, name, first_name, last_name, username, avatar_url")
    .in("id", authorIds);

  if (authorsError) {
    console.error("Feed authors error:", authorsError);
  }

  const authorsById = new Map(
    (authors ?? []).map((author) => [author.id, author]),
  );

  const tagsByPost = new Map<string, Tag[]>();

  if (postIds.length > 0) {
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
      console.error("Feed tags error:", tagError);
    }

    for (const row of tagRows ?? []) {
      const existing = tagsByPost.get(row.post_id) ?? [];
      const tags = normalizeTag(row.tags as Tag | Tag[] | null);

      tagsByPost.set(row.post_id, [...existing, ...tags]);
    }
  }

  const posts: FeedPost[] = pageRows.map((post: FeedPost) => ({
    id: post.id,
    author_id: post.author_id,
    title: post.title,
    excerpt: post.excerpt,
    content_markdown: post.content_markdown,
    published_at: post.published_at,
    matched_tag_count: Number(post.matched_tag_count ?? 0),
    score: Number(post.score ?? 0),
    like_count: Number(post.like_count ?? 0),
    bookmark_count: Number(post.bookmark_count ?? 0),
    comment_count: Number(post.comment_count ?? 0),
    view_count: Number(post.view_count ?? 0),
    tags: tagsByPost.get(post.id) ?? [],
    author: authorsById.get(post.author_id) ?? null,
  }));

  return {
    posts,
    nextCursor: posts.at(-1)?.published_at ?? null,
    hasMore,
  };
}
