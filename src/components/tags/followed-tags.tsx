import { createClient } from "@/lib/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowedTagBadge } from "./followed-tag-badge";

type Tag = {
  id: string;
  name: string;
};

function normalizeTag(value: Tag | Tag[] | null): Tag[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function FollowedTags() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("tag_follows")
    .select(
      `
      tag_id,
      tags (
        id,
        name
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Followed tags error:", error);
  }

  const followedTags =
    data?.flatMap((item) => normalizeTag(item.tags as Tag | Tag[] | null)) ??
    [];

  return (
    <Card className="rounded-2xl mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-base">Your Tags</CardTitle>
      </CardHeader>

      <CardContent>
        {followedTags.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Follow tags to personalize your feed.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {followedTags.map((tag) => (
              <FollowedTagBadge
                key={tag.id}
                tagId={tag.id}
                tagName={tag.name}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
