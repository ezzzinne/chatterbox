import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bookmark, Eye, Heart, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Route } from "next";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    excerpt: string | null;
    content_markdown: string;
    published_at: string | null;
    view_count?: number;
    like_count?: number;
    bookmark_count?: number;
    comment_count?: number;
    author?: {
      id: string;
      name: string | null;
      first_name: string | null;
      last_name: string | null;
      username: string | null;
      avatar_url: string | null;
    } | null;
    tags?: {
      id: string;
      name: string;
    }[];
  };
};

export function PostCard({ post }: PostCardProps) {
  const truncateText = (text: string, maxLength = 80) => {
    if (!text) return "";

    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + "...";
  };

  return (
    <Card className="grid gap-4 h-full transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/20">
      <CardHeader>
        <CardTitle>
          <h2 className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight">
            {post.title || "Untitled"}
          </h2>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {post.excerpt && (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {truncateText(post.excerpt)}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post.like_count ?? 0}
          </div>

          <div className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            {post.bookmark_count ?? 0}
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.comment_count ?? 0}
          </div>

          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.view_count ?? 0}
          </div>
        </div>

        <Link href={`/dashboard/articles/${post.id}` as Route}>
          <Button variant="default" className="font-medium">
            Read
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
