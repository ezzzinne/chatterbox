import { createClient } from "@/lib/server";
import { PostEditor } from "@/components/editor/post-editor";

export default async function NewPostPage() {
  const supabase = await createClient();

  const { data: tags, error } = await supabase
    .from("tags")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching tags:", error);
  }

  return <PostEditor tags={tags ?? []} />;
}
