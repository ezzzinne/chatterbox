"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createCommentAction } from "@/actions/comments";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CommentAuthor = {
  id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

export type Comment = {
  id: string;
  body: string;
  author_id: string;
  parent_id: string | null;
  depth: number;
  created_at: string;
  post_id: string;
  author: CommentAuthor | null;
};

type Props = {
  postId: string;
  currentUserId: string;
  initialComments?: Comment[];
};

export function CommentsSection({ postId, initialComments = [] }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isPosting, setIsPosting] = useState(false);
  const [body, setBody] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handlePostComment = async () => {
    if (!body.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      setIsPosting(true);

      const newComment = await createCommentAction({
        postId,
        body,
      });

      setComments((current) => [...current, newComment]);
      setBody("");

      toast.success("Comment posted.");
    } catch (error) {
      console.error("Post comment failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to post comment.",
      );
    } finally {
      setIsPosting(false);
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!replyBody.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }

    try {
      setIsReplying(true);

      const newReply = await createCommentAction({
        postId,
        body: replyBody,
        parentId,
      });

      setComments((current) => [...current, newReply]);
      setReplyBody("");
      setReplyingTo(null);

      toast.success("Reply posted.");
    } catch (error) {
      console.error("Post reply failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to post reply.",
      );
    } finally {
      setIsReplying(false);
    }
  };

  const getAuthorName = (author: CommentAuthor | null) => {
    if (!author) return "Unknown User";

    if (author.name) return author.name;

    const fullName =
      `${author.first_name ?? ""} ${author.last_name ?? ""}`.trim();

    return fullName || author.username || "Unknown User";
  };

  const getAuthorInitials = (author: CommentAuthor | null) => {
    if (!author) return "";

    const first = author.first_name?.[0] ?? "";
    const last = author.last_name?.[0] ?? "";

    const initials = `${first}${last}`.toUpperCase();

    return initials || author.name?.[0]?.toUpperCase() || "";
  };

  const topLevelComments = comments.filter((comment) => !comment.parent_id);

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold mt-4">Comments</h2>

          <p className="text-sm text-muted-foreground">
            Join the conversation.
          </p>
        </div>

        <span className="text-sm text-muted-foreground">
          {topLevelComments.length} comments
        </span>
      </div>

      <div className="bg-card">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-28 border-0 shadow-none focus-visible:ring-0"
        />

        <div className="mt-4 flex justify-end">
          <Button
            disabled={isPosting || !body.trim()}
            onClick={handlePostComment}
          >
            {isPosting ? "Posting..." : "Post comment"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          topLevelComments.map((comment) => {
            const replies = comments.filter(
              (reply) => reply.parent_id === comment.id,
            );

            const isReplyBoxOpen = replyingTo === comment.id;

            return (
              <div key={comment.id} className="border-b pb-5">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={comment.author?.avatar_url ?? ""} />
                    <AvatarFallback>
                      {getAuthorInitials(comment.author) ||
                        `${comment?.author?.first_name?.[0] ?? ""}${
                          comment?.author?.last_name?.[0] ?? ""
                        }`.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {getAuthorName(comment.author)}
                      </p>

                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-7">{comment.body}</p>

                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="mt-2 px-0"
                      onClick={() =>
                        setReplyingTo(isReplyBoxOpen ? null : comment.id)
                      }
                    >
                      {isReplyBoxOpen ? "Cancel" : "Reply"}
                    </Button>

                    {isReplyBoxOpen && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="Write a reply..."
                          className="min-h-20 resize-none"
                        />

                        <Button
                          type="button"
                          className="my-2"
                          size="sm"
                          onClick={() => handlePostReply(comment.id)}
                          disabled={isReplying || !replyBody.trim()}
                        >
                          {isReplying ? "Posting..." : "Post reply"}
                        </Button>
                      </div>
                    )}

                    {replies.length > 0 && (
                      <div className="mt-4 space-y-3 border-l pl-4">
                        {replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="flex gap-3 rounded-xl bg-muted/40 p-3"
                          >
                            <Avatar>
                              <AvatarImage
                                src={reply.author?.avatar_url ?? ""}
                              />
                              <AvatarFallback>
                                {getAuthorInitials(reply.author) ||
                                  `${reply?.author?.first_name?.[0] ?? ""}${
                                    reply?.author?.last_name?.[0] ?? ""
                                  }`.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">
                                  {getAuthorName(reply.author)}
                                </p>

                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    reply.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              <p className="mt-1 text-sm leading-6">
                                {reply.body}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
