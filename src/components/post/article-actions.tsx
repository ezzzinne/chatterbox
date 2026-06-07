"use client";

import { useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLikeAction } from "@/actions/likes";
import { toggleBookmarkAction } from "@/actions/bookmarks";

type Props = {
  postId: string;
  initialLiked: boolean;
  initialBookmarked: boolean;
};

export function ArticleActions({
  postId,
  initialLiked,
  initialBookmarked,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleLike = async () => {
    try {
      setIsLiking(true);

      const result = await toggleLikeAction(postId);

      setLiked(result.liked);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);

      const result = await toggleBookmarkAction(postId);

      setBookmarked(result.bookmarked);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-6">
      <Button
        variant={liked ? "default" : "ghost"}
        size="sm"
        onClick={handleLike}
        disabled={isLiking}
      >
        <Heart className="h-4 w-4" />
        <span>{liked ? "Liked" : "Like"}</span>
      </Button>

      <Button
        variant={bookmarked ? "default" : "ghost"}
        size="sm"
        onClick={handleBookmark}
        disabled={isBookmarking}
      >
        <Bookmark className="h-4 w-4" />
        <span>{bookmarked ? "Saved" : "Save"}</span>
      </Button>
    </div>
  );
}
