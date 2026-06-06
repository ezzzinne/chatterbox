import { createClient } from "@/lib/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { FollowTagButton } from "./follow-tag-button";

type SuggestedTag = {
  id: string;
  name: string;
  post_count: number | null;
};

export async function SuggestedTags() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_suggested_tags");

  const tags = (data ?? []) as SuggestedTag[];

  if (error) {
    console.error("Suggested tags error:", error);
  }

  return (
    <Card className="rounded-2xl mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          Suggested Tags
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {!tags || tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No suggested tags yet.
          </p>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-muted"
            >
              <div className="space-y-1">
                <Badge variant="secondary">#{tag.name}</Badge>

                <p className="text-xs text-muted-foreground">
                  {tag.post_count ?? 0} posts
                </p>
              </div>

              <FollowTagButton tagId={tag.id} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
