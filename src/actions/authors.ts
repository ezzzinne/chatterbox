"use server";

import { createClient } from "@/lib/server";

export async function toggleAuthorFollowAction(authorId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in.");
  }

  if (user.id === authorId) {
    throw new Error("You cannot follow yourself.");
  }

  const { data: existingFollow, error: checkError } = await supabase
    .from("author_follows")
    .select("author_id")
    .eq("follower_id", user.id)
    .eq("author_id", authorId)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  if (existingFollow) {
    const { error } = await supabase
      .from("author_follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("author_id", authorId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      following: false,
    };
  }

  const { error } = await supabase.from("author_follows").insert({
    follower_id: user.id,
    author_id: authorId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    following: true,
  };
}
