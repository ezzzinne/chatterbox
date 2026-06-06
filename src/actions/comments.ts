"use server";

import { createClient } from "@/lib/server";

type CreateCommentInput = {
  postId: string;
  body: string;
  parentId?: string | null;
};

export async function createCommentAction(input: CreateCommentInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to comment.");
  }

  const body = input.body.trim();

  if (!body) {
    throw new Error("Comment cannot be empty.");
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: input.postId,
      author_id: user.id,
      parent_id: input.parentId ?? null,
      body,
    })
    .select("id, post_id, author_id, parent_id, body, depth, created_at")
    .single();

  if (error) {
    console.error("Create comment error:", error);
    throw new Error(error.message);
  }

  const { data: author } = await supabase
    .from("profiles")
    .select("id, name, first_name, last_name, username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return {
    ...data,
    author: author ?? null,
  };
}
