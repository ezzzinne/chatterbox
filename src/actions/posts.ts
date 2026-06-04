"use server";

import { createClient } from "@/lib/server";

type SaveDraftInput = {
  postId?: string | null;
  title: string;
  excerpt: string;
  content: string;
  status: string;
  tagIds: string[];
};

export async function saveDraftAction(input: SaveDraftInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to create a post.");
  }

  let postId = input.postId;

  if (!postId) {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: input.title,
        excerpt: input.excerpt,
        content_markdown: input.content,
        status: input.status,
        author_id: user.id,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }
    postId = data.id;
  } else {
    const { error } = await supabase
      .from("posts")
      .update({
        title: input.title,
        excerpt: input.excerpt,
        content_markdown: input.content,
        status: input.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("author_id", user.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  const { error: deleteTagsError } = await supabase
    .from("post_tags")
    .delete()
    .eq("post_id", postId);

  if (deleteTagsError) {
    throw new Error(deleteTagsError.message);
  }

  if (input.tagIds.length > 0) {
    const { error: insertTagsError } = await supabase.from("post_tags").insert(
      input.tagIds.map((tagId) => ({
        post_id: postId,
        tag_id: tagId,
      })),
    );

    if (insertTagsError) {
      throw new Error(insertTagsError.message);
    }
  }

  return {
    postId,
  };
}

export async function publishPostAction(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in.");
  }

  const { error } = await supabase
    .from("posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
