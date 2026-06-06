"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { toggleTagFollowAction } from "@/actions/tags";

type Props = {
  tagId: string;
  tagName: string;
};

export function FollowedTagBadge({ tagId, tagName }: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);

      await toggleTagFollowAction(tagId);

      router.refresh();
    } catch (error) {
      console.error("Unfollow tag error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUnfollow}
      disabled={isLoading}
      title={`Unfollow ${tagName}`}
      className="disabled:opacity-50"
    >
      <Badge
        variant="secondary"
        className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 transition hover:bg-destructive hover:text-destructive-foreground"
      >
        #{tagName}
        <X className="h-3 w-3" />
      </Badge>
    </button>
  );
}