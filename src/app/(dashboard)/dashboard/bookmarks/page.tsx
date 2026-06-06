import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { PostCard } from "@/components/post/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

type Tag = {
  id: string;
  name: string;
};

type Author = {
  id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type BookmarkedPost = {
  id: string;
  author_id: string;
  title: string;
  excerpt: string | null;
  content_markdown: string | null;
  published_at: string | null;
  status: string;
};

type BookmarkRow = {
  created_at: string;
  posts: BookmarkedPost | BookmarkedPost[] | null;
};

function normalizePost(
  value: BookmarkedPost | BookmarkedPost[] | null,
): BookmarkedPost | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function normalizeTag(value: Tag | Tag[] | null): Tag[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function BookmarksPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: bookmarkData, error: bookmarksError } = await supabase
    .from("bookmarks")
    .select(
      `
    created_at,
    posts (
      id,
      author_id,
      title,
      excerpt,
      content_markdown,
      published_at,
      status
    )
  `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (bookmarksError) {
    console.error("Bookmarks fetch error:", bookmarksError);
  }

  const bookmarkRows = (bookmarkData ?? []) as BookmarkRow[];

  const bookmarkedPosts = bookmarkRows
    .map((row) => normalizePost(row.posts))
    .filter((post): post is BookmarkedPost => Boolean(post))
    .filter((post) => post.status === "published");
    
  const postIds = bookmarkedPosts.map((post) => post.id);

  const likeCounts = new Map<string, number>();
  const bookmarkCounts = new Map<string, number>();
  const commentCounts = new Map<string, number>();
  const viewCounts = new Map<string, number>();

  if (postIds.length > 0) {
    const [likesResult, bookmarksResult, commentsResult, viewsResult] =
      await Promise.all([
        supabase.from("post_likes").select("post_id").in("post_id", postIds),
        supabase.from("bookmarks").select("post_id").in("post_id", postIds),
        supabase.from("comments").select("post_id").in("post_id", postIds),
        supabase.from("post_views").select("post_id").in("post_id", postIds),
      ]);

    for (const row of likesResult.data ?? []) {
      likeCounts.set(row.post_id, (likeCounts.get(row.post_id) ?? 0) + 1);
    }

    for (const row of bookmarksResult.data ?? []) {
      bookmarkCounts.set(
        row.post_id,
        (bookmarkCounts.get(row.post_id) ?? 0) + 1,
      );
    }

    for (const row of commentsResult.data ?? []) {
      commentCounts.set(row.post_id, (commentCounts.get(row.post_id) ?? 0) + 1);
    }

    for (const row of viewsResult.data ?? []) {
      viewCounts.set(row.post_id, (viewCounts.get(row.post_id) ?? 0) + 1);
    }

    if (likesResult.error)
      console.error("Likes count error:", likesResult.error);
    if (bookmarksResult.error)
      console.error("Bookmarks count error:", bookmarksResult.error);
    if (commentsResult.error)
      console.error("Comments count error:", commentsResult.error);
    if (viewsResult.error)
      console.error("Views count error:", viewsResult.error);
  }

  const authorIds = [...new Set(bookmarkedPosts.map((post) => post.author_id))];

  const tagsByPost = new Map<string, Tag[]>();
  const authorsById = new Map<string, Author>();

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
      console.error("Bookmark tags fetch error:", tagError);
    }

    for (const row of tagRows ?? []) {
      const existing = tagsByPost.get(row.post_id) ?? [];
      const tags = normalizeTag(row.tags as Tag | Tag[] | null);

      tagsByPost.set(row.post_id, [...existing, ...tags]);
    }
  }

  if (authorIds.length > 0) {
    const { data: authors, error: authorsError } = await supabase
      .from("profiles")
      .select("id, name, first_name, last_name, username, avatar_url")
      .in("id", authorIds);

    if (authorsError) {
      console.error("Bookmark authors fetch error:", authorsError);
    }

    for (const author of authors ?? []) {
      authorsById.set(author.id, author);
    }
  }

  const posts = bookmarkedPosts.map((post) => ({
    id: post.id,
    author_id: post.author_id,
    title: post.title,
    excerpt: post.excerpt,
    content_markdown: post.content_markdown ?? "",
    published_at: post.published_at,
    tags: tagsByPost.get(post.id) ?? [],
    author: authorsById.get(post.author_id) ?? null,

    like_count: likeCounts.get(post.id) ?? 0,
    bookmark_count: bookmarkCounts.get(post.id) ?? 0,
    comment_count: commentCounts.get(post.id) ?? 0,
    view_count: viewCounts.get(post.id) ?? 0,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>

          <p className="text-muted-foreground">
            Posts you have saved for later.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">No bookmarks found</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              You have not bookmarked any posts yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 mt-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
