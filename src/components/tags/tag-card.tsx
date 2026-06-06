import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Route } from "next";

type TagCardProps = {
  tag: {
    id: string;
    name: string;
    post_count?: number;
    isFollowing?: boolean;
  };
};

export function TagCard({ tag }: TagCardProps) {
  return (
    <Card className="rounded-2xl transition hover:bg-muted/40">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-semibold hover:underline">#{tag.name}</h3>

          <p className="text-sm text-muted-foreground">
            {tag.post_count ?? 0} posts
          </p>
        </div>

        <Link href={`/dashboard/tags/${tag.id}` as Route}>
          <Badge variant={tag.isFollowing ? "default" : "secondary"}>
            {tag.isFollowing ? "Following" : "Follow"}
          </Badge>
        </Link>
      </CardContent>
    </Card>
  );
}
