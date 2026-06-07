"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft, Clock } from "lucide-react";
import { calculateReadingTime } from "@/lib/reading-time";
import { ArticleActions } from "./article-actions";
import { Comment, CommentsSection } from "./comment-section";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { FollowAuthorButton } from "../profile/follow-author-button";
import Link from "next/link";
import { Route } from "next";

type ArticlePreviewProps = {
  post: {
    id: string;
    author_id: string;
    title: string;
    excerpt: string | null;
    content_markdown: string;
    status: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    isAuthor?: boolean;
    isLiked?: boolean;
    isBookmarked?: boolean;
    isFollowingAuthor?: boolean;
    tags: {
      id: string;
      name: string;
    }[];
    author: {
      id: string | null;
      name: string | null;
      first_name: string | null;
      last_name: string | null;
      username: string | null;
      avatar_url: string | undefined;
      bio: string | null;
    } | null;
  };
  currentUserId: string;
  initialComments: Comment[];
};

export function ArticlePreview({
  post,
  currentUserId,
  initialComments,
}: ArticlePreviewProps) {
  const readingTime = calculateReadingTime(post.content_markdown);

  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
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
                  <span className="text-muted-foreground">
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

            <CardContent>
              <article className="max-w-none text-base leading-8 [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_p]:mb-6 [&_ul]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content_markdown}
                </ReactMarkdown>
              </article>

              <ArticleActions
                postId={post.id}
                initialLiked={post.isLiked ?? false}
                initialBookmarked={post.isBookmarked ?? false}
              />

              <Separator />

              <CommentsSection
                postId={post.id}
                initialComments={initialComments}
                currentUserId={currentUserId}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:block">
          <Card className="rounded-2xl mt-4">
            <CardTitle className="uppercase flex items-center px-6 text-muted-foreground">
              Author
            </CardTitle>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={post.author?.avatar_url} />
                  <AvatarFallback>
                    {(post.author?.first_name?.[0] ?? "") +
                      (post.author?.last_name?.[0] ?? "")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-sm font-semibold leading-tight truncate">
                    {post.author?.name}
                  </h3>
                  <Link
                    href={`/dashboard/users/${post?.author?.username}` as Route}
                  >
                    <p className="text-xs text-muted-foreground truncate">
                      @{post.author?.username}
                    </p>
                  </Link>
                </div>
              </div>

              {post.author?.bio && (
                <p className="text-sm leading-6 text-muted-foreground">
                  {post.author.bio}
                </p>
              )}

              {!post.isAuthor && (
                <FollowAuthorButton
                  authorId={post.author_id}
                  initiallyFollowing={post.isFollowingAuthor ?? false}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
