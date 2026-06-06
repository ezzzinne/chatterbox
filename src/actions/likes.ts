"use server";

import { createClient } from "@/lib/server";

export async function toggleLikeAction(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in.");

  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingLike) {
    await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    return { liked: false };
  }

  await supabase.from("post_likes").insert({
    post_id: postId,
    user_id: user.id,
  });

  return { liked: true };
}
