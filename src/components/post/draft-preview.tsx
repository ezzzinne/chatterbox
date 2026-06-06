"use client";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { publishPostAction } from "@/actions/posts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft, Clock, Pencil, Upload } from "lucide-react";

import { Route } from "next";
import { calculateReadingTime } from "@/lib/reading-time";
import { toast } from "sonner";
import { useState } from "react";

type DraftPreviewProps = {
  post: {
    id: string;
    title: string;
    excerpt: string | null;
    content_markdown: string;
    status: string;
    created_at: string;
    updated_at: string;
    tags: {
      id: string;
      name: string;
    }[];
  };
};

export function DraftPreview({ post }: DraftPreviewProps) {
  const router = useRouter();

  const [isPublishing, setIsPublishing] = useState(false);

  const canPublish =
    post.title.trim().length > 0 && post.content_markdown.trim().length > 0;

  const handlePublish = async () => {
    if (!canPublish) {
      toast.error("Add a title and content before publishing.");
      return;
    }

    try {
      setIsPublishing(true);

      await publishPostAction(post.id);

      router.push("/dashboard/articles" as Route);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to publish post.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const readingTime = calculateReadingTime(post.content_markdown);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="mb-3"
            onClick={() =>
              router.push(`/dashboard/posts/edit/${post.id}` as Route)
            }
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="mb-3"
          >
            <Upload className="h-4 w-4" />
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Draft Preview</h2>

        <p className="mt-1 text-muted-foreground">
          Review your article before publishing.
        </p>
      </div>

      <Card className="mt-4">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{post.title || "Untitled"}</h2>

            {post.excerpt && (
              <p className="mt-3 text-lg text-muted-foreground">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              Last updated {new Date(post.updated_at).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>

        <Separator />

        <CardContent>
          <article className="leading-8 text-base md:text-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content_markdown}
            </ReactMarkdown>
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
