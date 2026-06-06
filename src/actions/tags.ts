"use server";

import { createClient } from "@/lib/server";

export async function toggleTagFollowAction(tagId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in.");
  }

  const { data: existingFollow, error: checkError } = await supabase
    .from("tag_follows")
    .select("tag_id")
    .eq("tag_id", tagId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  if (existingFollow) {
    const { error } = await supabase
      .from("tag_follows")
      .delete()
      .eq("tag_id", tagId)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return { following: false };
  }

  const { error } = await supabase.from("tag_follows").insert({
    tag_id: tagId,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { following: true };
}
