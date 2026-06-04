import { createClient } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import { PostEditor } from "@/components/editor/post-editor";

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function EditPostPage({ params }: Props) {
  const { postId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      excerpt,
      content_markdown,
      status,
      post_tags (
        tags (
          id,
          name
        )
      )
    `,
    )
    .eq("id", postId)
    .eq("author_id", user.id)
    .single();

  if (postError || !post) {
    notFound();
  }

  const { data: tags, error: tagsError } = await supabase
    .from("tags")
    .select("id, name")
    .order("name", { ascending: true });

  if (tagsError) {
    console.error("Tags error:", tagsError);
  }

  const selectedTags =
    post.post_tags?.flatMap((item) => item.tags ?? []).filter(Boolean) ?? [];

  return (
    <PostEditor
      tags={tags ?? []}
      post={{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt ?? "",
        content: post.content_markdown ?? "",
        status: post.status,
        selectedTags,
      }}
    />
  );
}
