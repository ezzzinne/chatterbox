"use server";

import { createClient } from "@/lib/server";

export async function markNotificationAsReadAction(notificationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in.");
  }

  const { error } = await supabase
    .from("notifications")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("recipient_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
