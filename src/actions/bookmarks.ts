"use server";

import { createClient } from "@/lib/server";

type ToggleBookmarkResult = {
  bookmarked: boolean;
};

export async function toggleBookmarkAction(
  postId: string,
): Promise<ToggleBookmarkResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to bookmark posts.");
  }

  const { data: existingBookmark, error: checkError } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (checkError) {
    console.error("Check bookmark error:", checkError);
    throw new Error(checkError.message);
  }

  if (existingBookmark) {
    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Remove bookmark error:", deleteError);
      throw new Error(deleteError.message);
    }

    return {
      bookmarked: false,
    };
  }

  const { error: insertError } = await supabase.from("bookmarks").insert({
    post_id: postId,
    user_id: user.id,
  });

  if (insertError) {
    console.error("Create bookmark error:", insertError);
    throw new Error(insertError.message);
  }

  return {
    bookmarked: true,
  };
}
