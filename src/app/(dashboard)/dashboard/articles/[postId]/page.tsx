import { createClient } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import { ArticlePreview } from "@/components/post/article-preview";
import { PostViewTracker } from "@/components/analytics/post-view-tracker";

type Props = {
  params: Promise<{
    postId: string;
  }>;
  currentUserId: string;
};

export default async function ArticlePage({ params, currentUserId }: Props) {
  const { postId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      author_id,
      title,
      excerpt,
      content_markdown,
      status,
      published_at,
      created_at,
      updated_at,
      post_tags (
        tags (
          id,
          name
        )
      )
    `,
    )
    .eq("id", postId)
    .eq("status", "published")
    .single();

  if (error || !post) {
    notFound();
  }

  if (post.status !== "published") {
    notFound();
  }

  // await recordPostViewAction(post.id);

  const { data: author } = await supabase
    .from("profiles")
    .select("id, name, first_name, last_name, username, avatar_url, bio")
    .eq("id", post.author_id)
    .maybeSingle();

  const isAuthor = post.author_id === user.id;

  let isFollowingAuthor = false;

  if (!isAuthor) {
    const { data: followData, error: followError } = await supabase
      .from("author_follows")
      .select("author_id")
      .eq("follower_id", user.id)
      .eq("author_id", post.author_id)
      .maybeSingle();

    if (followError) {
      console.error("Author follow check error:", followError);
    }

    isFollowingAuthor = !!followData;
  }

  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", post.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: existingBookmark } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("post_id", post.id)
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("Existing like:", existingLike);
  console.log("Existing bookmark:", existingBookmark);

  const { data: commentRows, error: commentsError } = await supabase
    .from("comments")
    .select("id, post_id, author_id, parent_id, body, depth, created_at")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  if (commentsError) {
    console.error("Comments fetch error:", commentsError);
  }

  const authorIds = [
    ...new Set((commentRows ?? []).map((comment) => comment.author_id)),
  ];

  const { data: commentAuthors, error: commentAuthorsError } = authorIds.length
    ? await supabase
        .from("profiles")
        .select("id, name, first_name, last_name, username, avatar_url")
        .in("id", authorIds)
    : { data: [], error: null };

  if (commentAuthorsError) {
    console.error("Comment authors fetch error:", commentAuthorsError);
  }

  const authorsById = new Map(
    (commentAuthors ?? []).map((author) => [author.id, author]),
  );

  const comments =
    commentRows?.map((comment) => ({
      ...comment,
      author: authorsById.get(comment.author_id) ?? null,
    })) ?? [];

  const tags =
    post.post_tags?.flatMap((item) => item.tags ?? []).filter(Boolean) ?? [];

  const normalizedPost = {
    id: post.id,
    author_id: post.author_id,
    title: post.title,
    excerpt: post.excerpt,
    content_markdown: post.content_markdown ?? "",
    status: post.status,
    published_at: post.published_at,
    created_at: post.created_at,
    updated_at: post.updated_at,
    tags,
    isAuthor: post.author_id === user.id,
    isFollowingAuthor,
    isLiked: !!existingLike,
    isBookmarked: !!existingBookmark,
    author: author
      ? {
          id: author.id,
          name: author.name ?? null,
          first_name: author.first_name ?? null,
          last_name: author.last_name ?? null,
          username: author.username ?? null,
          avatar_url: author.avatar_url ?? null,
          bio: author.bio ?? null,
        }
      : null,
  };

  return (
    <>
      <PostViewTracker postId={post.id} userId={currentUserId} />
      <ArticlePreview
        post={{
          ...normalizedPost,
          isLiked: !!existingLike,
          isBookmarked: !!existingBookmark,
        }}
        currentUserId={user.id}
        initialComments={comments ?? []}
      />
    </>
  );
}
