import { createClient } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import { ArticlePreview } from "@/components/post/article-preview";

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function ArticlePage({ params }: Props) {
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

  const tags =
    post.post_tags?.flatMap((item) => item.tags ?? []).filter(Boolean) ?? [];

  const normalizedPost = {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content_markdown: post.content_markdown ?? "",
    status: post.status,
    published_at: post.published_at,
    created_at: post.created_at,
    updated_at: post.updated_at,
    tags,
    isAuthor: post.author_id === user.id,
  };

  return <ArticlePreview post={normalizedPost} />;
}
