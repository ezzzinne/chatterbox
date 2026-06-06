"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { toggleAuthorFollowAction } from "@/actions/authors";

type Props = {
  authorId: string;
  initiallyFollowing: boolean | undefined;
};

export function FollowAuthorButton({ authorId, initiallyFollowing }: Props) {
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(initiallyFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    try {
      setIsLoading(true);

      const result = await toggleAuthorFollowAction(authorId);

      setIsFollowing(result.following);

      toast.success(
        result.following ? "Author followed." : "Author unfollowed.",
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update follow.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={isLoading}
      variant={isFollowing ? "secondary" : "default"}
    >
      {isLoading ? "Updating..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
