"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleTagFollowAction } from "@/actions/tags";
import { useRouter } from "next/navigation";

type Props = {
  tagId: string;
  initiallyFollowing?: boolean;
};

export function FollowTagButton({ tagId, initiallyFollowing = false }: Props) {
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(initiallyFollowing);

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setIsLoading(true);

      const result = await toggleTagFollowAction(tagId);

      setIsFollowing(result.following);

      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={isFollowing ? "default" : "outline"}
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isLoading ? "Updating..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
