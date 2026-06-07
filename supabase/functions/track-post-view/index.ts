import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { postId, userId, sessionId } = await req.json();

    if (!postId) {
      return new Response(JSON.stringify({ error: "postId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const userAgent = req.headers.get("user-agent");
    const referrer = req.headers.get("referer");

    if (sessionId) {
      const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();

      const { data: recentEvent } = await supabase
        .from("analytics_events")
        .select("id")
        .eq("post_id", postId)
        .eq("event_type", "view")
        .eq("session_id", sessionId)
        .gte("created_at", since)
        .maybeSingle();

      if (recentEvent) {
        return new Response(JSON.stringify({ success: true, deduped: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { error: analyticsError } = await supabase
      .from("analytics_events")
      .insert({
        post_id: postId,
        user_id: userId ?? null,
        session_id: sessionId ?? null,
        event_type: "view",
        user_agent: userAgent,
        referrer,
      });

    if (analyticsError) {
      throw analyticsError;
    }

    // Fallback logic
    const { error: postViewsError } = await supabase.from("post_views").insert({
      post_id: postId,
      user_id: userId ?? null,
    });

    if (postViewsError) {
      throw postViewsError;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
