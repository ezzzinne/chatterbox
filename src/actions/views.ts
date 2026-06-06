"use server";

import { createClient } from "@/lib/server";

export async function recordPostViewAction(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return;
  }

  const { data: recentView } = await supabase
    .from("post_views")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .gte("viewed_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .maybeSingle();

  if (recentView) {
    return;
  }

  const { error } = await supabase.from("post_views").insert({
    post_id: postId,
    user_id: user.id,
  });

  if (error) {
    console.error("Record post view error:", error);
  }
}
