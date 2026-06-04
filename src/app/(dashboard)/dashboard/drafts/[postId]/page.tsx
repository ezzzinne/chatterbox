import { createClient } from "@/lib/server";
import { notFound, redirect } from "next/navigation";
import { DraftPreview } from "@/components/post/draft-preview";

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function DraftPreviewPage({ params }: Props) {
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
    .single();

  if (error || !post) {
    notFound();
  }

  if (post.author_id !== user.id) {
    notFound();
  }

  if (post.status !== "draft") {
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
    created_at: post.created_at,
    updated_at: post.updated_at,
    tags,
  };

  return <DraftPreview post={normalizedPost} />;
}
