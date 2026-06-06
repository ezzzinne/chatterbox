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

type SaveDraftResult = {
  postId: string | null;
  skipped: boolean;
  message?: string;
};

export async function saveDraftAction(
  input: SaveDraftInput,
): Promise<SaveDraftResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to create a post.");
  }

  const hasContent = input.content.trim().length > 0;

  if (!hasContent) {
    return {
      postId: input.postId ?? null,
      skipped: true,
      message: "Draft was not saved because content is empty.",
    };
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
    postId: postId ?? null,
    skipped: false,
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

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, title, content_markdown")
    .eq("id", postId)
    .eq("author_id", user.id)
    .single();

  if (postError || !post) {
    throw new Error("Post not found.");
  }

  const hasTitle = post.title?.trim().length > 0;
  const hasContent = post.content_markdown?.trim().length > 0;

  if (!hasTitle || !hasContent) {
    throw new Error("A post must have a title and content before publishing.");
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
