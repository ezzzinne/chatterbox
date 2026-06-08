import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/posts", () => {
    return HttpResponse.json([
      {
        id: "post-1",
        title: "Testing Supabase",
        excerpt: "A post about testing.",
        like_count: 2,
        bookmark_count: 1,
        comment_count: 3,
        view_count: 10,
      },
    ]);
  }),

  http.post("/api/comments", async ({ request }) => {
    const body = (await request.json()) as {
      postId: string;
      body: string;
    };

    return HttpResponse.json({
      id: "comment-1",
      post_id: body.postId,
      body: body.body,
      created_at: new Date().toISOString(),
    });
  }),
];
