"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  profile: {
    id: string;
    name: string | null;
    last_name: string | null;
    first_name: string | null;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
    follower_count: number;
    post_count: number;
    isCurrentUser: boolean;
    isFollowing?: boolean;
  };
};

export function ProfileHeader({ profile }: Props) {
  const router = useRouter();
  return (
    <section className="space-y-8">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="flex items-start">
        <div className="flex gap-6">
          <Avatar>
            <AvatarImage src={profile.avatar_url ?? ""} />
            <AvatarFallback className="text-lg">
              {(profile.first_name?.[0]?.toUpperCase() ?? "") +
                (profile.last_name?.[0]?.toUpperCase() ?? "")}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {profile.name ?? "Unnamed User"}
              </h1>

              <p className="text-muted-foreground">
                @{profile.username ?? "user"}
              </p>
            </div>

            {profile.bio && (
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div>
                <span className="font-semibold">{profile.follower_count}</span>{" "}
                <span className="text-muted-foreground">
                  {Number(profile.follower_count) === 1
                    ? "follower"
                    : "followers"}
                </span>
              </div>

              <div>
                <span className="font-semibold">{profile.post_count}</span>{" "}
                <span className="text-muted-foreground">posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b" />
    </section>
  );
}
