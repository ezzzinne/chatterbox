"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/client";

type Props = {
  postId: string;
  userId: string | null;
};

function getSessionId() {
  const key = "analytics_session_id";

  const existing = localStorage.getItem(key);

  if (existing) return existing;

  const next = crypto.randomUUID();

  localStorage.setItem(key, next);

  return next;
}

export function PostViewTracker({ postId, userId }: Props) {
  useEffect(() => {
    const supabase = createClient();

    const sessionId = getSessionId();

    supabase.functions
      .invoke("track-post-view", {
        body: {
          postId,
          userId,
          sessionId,
        },
      })
      .then(({ error }) => {
        if (error) {
          console.error("Track post view error:", error);
        }
      });
  }, [postId, userId]);

  return null;
}
