"use client";

import Link from "next/link";
import { Route } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft, Clock } from "lucide-react";
import { calculateReadingTime } from "@/lib/reading-time";

type ArticlePreviewProps = {
  post: {
    id: string;
    title: string;
    excerpt: string | null;
    content_markdown: string;
    status: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    isAuthor?: boolean;
    tags: {
      id: string;
      name: string;
    }[];
  };
};

export function ArticlePreview({ post }: ArticlePreviewProps) {
  const readingTime = calculateReadingTime(post.content_markdown);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild>
          <Link href={"/dashboard/articles" as Route}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card className="mt-4">
        <CardHeader className="space-y-5">
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

          <div className="flex flex-col gap-6">
            {post.published_at && (
              <span>
                Published{" "}
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            
            <h1 className="text-3xl font-bold tracking-tight">
              {post.title || "Untitled"}
            </h1>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-8">
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
